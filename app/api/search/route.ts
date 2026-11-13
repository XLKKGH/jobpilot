import {getDb} from '../../../db';
import {searches} from '../../../db/schema';
import {match,VERSION,type Job,type Profile} from '../../../lib/match';
const SOURCES=[{company:'Anthropic',slug:'anthropic'},{company:'Databricks',slug:'databricks'},{company:'Scale AI',slug:'scaleai'}];
const clean=(s:string)=>{for(let i=0;i<2;i++)s=s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/&mdash;/g,'—').replace(/&ndash;/g,'–').replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n)));return s.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<\/(?:p|li|h[1-6]|div)>/gi,'\n').replace(/<[^>]*>/g,' ').replace(/[ \t]+/g,' ').replace(/\n\s*\n/g,'\n').trim();};
export async function POST(request:Request){try{
 const body=await request.text();if(body.length>12000)return Response.json({error:'Profile is too long.'},{status:400});
 const p=JSON.parse(body) as Profile;
 if(!['Software','Data','AI'].includes(p.role)||!p.skills?.trim()||p.skills.length>2000)return Response.json({error:'Choose a discipline and add skills.'},{status:400});
 p.location=String(p.location||'').slice(0,100);p.level=String(p.level||'');p.excluded=String(p.excluded||'').slice(0,1000);
 const now=new Date().toISOString();
 const results=await Promise.all(SOURCES.map(async s=>{try{
 const url=`https://boards-api.greenhouse.io/v1/boards/${s.slug}/jobs?content=true`;
 const res=await fetch(url,{signal:AbortSignal.timeout(15000)});if(!res.ok)throw new Error(`HTTP ${res.status}`);
 const data=await res.json() as {jobs:any[]};if(!Array.isArray(data.jobs))throw new Error('Invalid board response');
 const jobs:Job[]=data.jobs.filter(j=>/^https:\/\//.test(j.absolute_url)).map(j=>({id:s.slug+'-'+j.id,title:j.title,company:s.company,location:j.location?.name||'Not specified',url:j.absolute_url,description:clean(j.content||''),source:url,fetchedAt:now}));
 return {company:s.company,count:jobs.length,status:'Fetched',jobs};
 }catch{return {company:s.company,count:0,status:'Unavailable — not treated as no openings',jobs:[] as Job[]}}}));
 const all=results.flatMap(r=>r.jobs).map(j=>match(j,p));
 const eligible=all.filter(j=>!j.excluded&&j.roleMatch).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
 const jobs=eligible.slice(0,10);
 if(!jobs.length)return Response.json({error:'No matching titles found in this limited company pool. Try another discipline or retry unavailable sources.',sources:results.map(({jobs,...r})=>r)},{status:422});
 const id=crypto.randomUUID(),token=crypto.randomUUID();
 const payload={id,version:VERSION,profile:p,createdAt:now,sources:results.map(({jobs,...r})=>r),total:all.length,excluded:all.filter(j=>j.excluded).length,jobs};
 await getDb().insert(searches).values({id,token,createdAt:now,payload:JSON.stringify(payload)});
 return Response.json({...payload,token});
 }catch(e){console.error(e);return Response.json({error:'Search could not be saved. Please retry; no simulated results have been substituted.'},{status:503})}}
