//用作过滤器的一个页面
//对外暴露一个方法
//将字符串转换为以千(k)为单位的一个字符
export function hotNumber(val){
	const number=parseInt(val);
	if(number<1000){
		return val;
	}
	//把val转换为字符串
	val=val+'';
	//字符串分割之后 取以千为单位的值
	return val.substring(0,val.length-3)+'k';
}