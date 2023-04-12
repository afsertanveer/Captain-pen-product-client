import { useEffect, useState } from "react";
const useRole = (userName) => {
  const [role, setRole] = useState('');
  useEffect(() => {
    if (userName) {
      
      fetch(`http://localhost:5000/users/${userName}`,{
        method:"GET",
        headers:{
            "content-type":"application/json"
        }
      })
        .then((res) => res.json())
        .then((data) => {
          setRole(data)
        });
    }
  }, [userName]);
  return role ;
};
export default useRole;
