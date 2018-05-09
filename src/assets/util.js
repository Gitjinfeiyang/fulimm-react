
export function getQuery(str){
    let string = str.replace("?","");
    let queryArr=string.split("&");
    let query={};
    let queryItem=[];
    for(let i=0; i<queryArr.length; i++){
        queryItem=queryArr[i].split("=");
        query[queryItem[0]]=queryItem[1];
    }
    return query;
}

export function formatDate(date){
    if(!date) return ['',''];
    let dateObj=date;
    if(dateObj.getTime){
  
    }else{
      try{
        dateObj=new Date(date);
      }catch(err){
        return [date,''];
      }
    }
  
    let day=dateObj.getDate();
    let month=dateObj.getMonth()+1;
    let year=dateObj.getFullYear();
    let hour=dateObj.getHours();
    let minute=dateObj.getMinutes();
    let second=dateObj.getSeconds();
    if(day<10) day='0'+day;
    if(month<10) month='0'+month;
    if(hour<10) hour='0'+hour;
    if(minute<10) minute='0'+minute;
    if(second<10) second='0'+second;
  
    return[year+'-'+month+'-'+day,hour+':'+minute+':'+second];
  
  }