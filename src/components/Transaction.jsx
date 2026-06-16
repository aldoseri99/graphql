import {Audit} from './Audit'
import { XpProgress } from "./XpProgress";
import './Transaction.css'
import { AuditTable } from './AuditTable';

export const Transaction = ({ transaction, token }) => {
  const xpProjects = (arr = []) =>
  arr.filter(proj => {
    return proj.type === 'xp' && proj.eventId === 763 
  }).reverse()

const getAudits = (arr = []) =>
  arr.filter(proj => {
    return (proj.type.toLowerCase() === 'up' || proj.type.toLowerCase() === 'down')
  }).reverse()

return (
  <>
    {transaction?.length === 0 && <p>Nothing here</p>}
    <div className="row">
      <Audit audit={getAudits(transaction)}/>
      <XpProgress arr={xpProjects(transaction)}/>
    </div>
    <AuditTable audit={getAudits(transaction)}/>
    </>
  );
};



