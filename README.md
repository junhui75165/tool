# tool
开发过程中用到的部分通用方法

## toThousands
使用：toThousands(number)
直接将数值转换为带有千分符的数值
例如1111，转换后为1,111.00，保留两位小数的字符串类型

## numToDX
使用：numToDX(number)
将数值转化为中午大写
零壹贰叁肆伍陆柒捌玖对应0123456789

## request
使用：request(json,function,string,)
机遇浏览器fetch方法的请求方法
请求参数说明；
json	传入请求参数，没参数时为{}

function	传入回调函数，在返回后直接掉用函数

string	传入请求类型
请求类型分为以下几种
### POST
### GET
### FormData
详细使用方法查看源码
