import {getDb} from '../../../db';
import {searches,trials} from '../../../db/schema';
import {eq} from 'drizzle-orm';
export async function POST(request:Request){try{
 const raw=await request.text();if(raw.length>50000)return Response.json({error:'Trial too large'},{status:400});
 const p=JSON.parse(raw);const db=getDb();const [search]=await db.select().from(searches).where(eq(searches.id,String(p.searchId))).limit(1);
 if(!search||p.token!==search.token)return Response.json({error:'Session not found'},{status:403});
 const snapshot=JSON.parse(search.payload);const valid=new Set(snapshot.jobs.map((j:any)=>j.id));
 if(!Array.isArray(p.before)||!Array.isArray(p.after)||[...p.before,...p.after].some((id:any)=>!valid.has(id))||!Number.isFinite(p.baselineMs)||!Number.isFinite(p.reviewMs)||p.baselineMs<0||p.reviewMs<0)return Response.json({error:'Invalid trial'},{status:400});
 const record={id:crypto.randomUUID(),createdAt:new Date().toISOString(),version:snapshot.version,searchId:search.id,participant:String(p.participant||'anonymous').slice(0,60),before:[...new Set(p.before)],after:[...new Set(p.after)],baselineMs:p.baselineMs,reviewMs:p.reviewMs,reason:String(p.reason||'').slice(0,2000),events:Array.isArray(p.events)?p.events.slice(0,200):[],snapshot};
 await db.insert(trials).values({id:record.id,searchId:search.id,createdAt:record.createdAt,payload:JSON.stringify(record)});
 return Response.json({record});
 }catch{return Response.json({error:'Could not save your trial. Keep this tab open and retry.'},{status:503})}}
