import React from "react";
import { getBlob } from "./idb";

export function useIDBObjectURL(imageKey){
  const [url, setUrl] = React.useState(null);
  React.useEffect(()=>{
    let revoked = false, current = null;
    (async ()=>{
      if (!imageKey){ setUrl(null); return; }
      const blob = await getBlob(imageKey);
      if (!blob){ setUrl(null); return; }
      current = URL.createObjectURL(blob);
      if (!revoked) setUrl(current);
    })();
    return ()=>{ revoked=true; if (current) URL.revokeObjectURL(current); };
  }, [imageKey]);
  return url;
}
