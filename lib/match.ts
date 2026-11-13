export const VERSION='abe-inspired-rules-v1';
export type Profile={role:string;skills:string;location:string;level:string;excluded:string};
export type Job={id:string;title:string;company:string;location:string;url:string;description:string;source:string;fetchedAt:string};
export function match(job:Job,p:Profile){
 const text=(job.title+' '+job.description).toLowerCase();
 const skills=[...new Set(p.skills.split(/[,\n]/).map(s=>s.trim().toLowerCase()).filter(Boolean))];
 const hits=skills.filter(s=>new RegExp('(^|[^a-z0-9])'+s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'([^a-z0-9]|$)','i').test(text));
 const groups:Record<string,RegExp>={Software:/software|developer|backend|frontend|full.stack|platform engineer|infrastructure engineer|systems engineer/i,Data:/data|analytics|scientist|machine learning/i,AI:/machine learning|artificial intelligence|research engineer|\bAI\b|\bML\b|inference/i};
 const roleMatch=(groups[p.role]||groups.Software).test(job.title);
 const locationMatch=!p.location.trim()||job.location.toLowerCase().includes(p.location.toLowerCase());
 const senior=/senior|staff|principal|lead|manager|director/i.test(job.title);
 const experience=job.description.match(/(?:have |at least |minimum of |minimum |requires? )?(\d+)\+?\s*(?:-|–|to)?\s*\d*\+?\s*years? (?:of )?(?:professional |relevant |industry |hands-on )?(?:software |engineering |work |industry |professional |relevant ){0,3}experience/i);
 const experienceYears=experience?Number(experience[1]):null;
 const levelConcern=p.level==='Early career'&&(senior||(experienceYears!==null&&experienceYears>=3));
 const excluded=p.excluded.split(/[,\n]/).map(s=>s.trim().toLowerCase()).filter(Boolean).includes(job.company.toLowerCase());
 const evidence=hits.map(s=>({skill:s,quote:job.description.split(/(?<=[.!?])\s+|\n/).find(line=>line.toLowerCase().includes(s))?.trim().slice(0,320)||s}));
 const concerns:string[]=[];
 if(!locationMatch)concerns.push('Posted location does not match your location text. Check remote eligibility and relocation.');
 if(levelConcern)concerns.push('The title or experience requirement signals a more senior role. Check scope and required experience.');
 const salary=job.description.match(/\$[\d,.]+\s*(?:k|K)?\s*(?:-|–|—|to)\s*\$?[\d,.]+\s*(?:k|K)?/);
 if(!salary)concerns.push('Compensation range was not detected; confirm on the original posting.');
 concerns.push('Work authorization and sponsorship have not been verified.');
 if(!hits.length)concerns.push('No exact skill terms matched. This does not prove you are unqualified.');
 const tier=!roleMatch||levelConcern||!locationMatch?'Stretch':!salary?'Questionable':hits.length>=Math.min(3,skills.length)&&hits.length?'Strong':'Good';
 const score=(roleMatch?40:0)+Math.min(hits.length,5)*8+(locationMatch?10:0)-(levelConcern?25:0);
 return {...job,hits,evidence,concerns,tier,score,salary:salary?.[0]||'Not detected',excluded,roleMatch,reason:`${hits.length} of ${skills.length} supplied skill terms appear in the posting. ${roleMatch?'Title aligns with your target discipline.':'Title may be outside your target discipline.'}`};
}
