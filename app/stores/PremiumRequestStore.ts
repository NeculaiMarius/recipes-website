export const approveRequest=async(requestId:number)=>{
  const response=await fetch(`/api/premium-requests/approve/${requestId}`)
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return true;
}

export const refuseRequest=async(requestId:number)=>{
  const response=await fetch(`/api/premium-requests/refuse/${requestId}`)
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return true;
}

export const sendRequest=async(userId:string)=>{
  const response= await fetch(`/api/premium-requests/${userId}`,{method:"POST"})
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return true;
}
