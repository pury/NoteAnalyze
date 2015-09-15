var data_json = null;
var data_type = [];
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
var data_date = year + "/" + month + "/" + day ;
var data_name = [];
var data_num = [0,0,0];
var data_today_begin = [];
var data_today_end =[];

function main()
{
	$.getJSON("data/data.json",function(data){
		data_json = data;
		update();
		updateData();
	});
}

function update()
{
	var type_index = 0;
	var tr_info = "";
	var flag = 0;
	var data_single = [];

	for(var i in data_json)
	{
		flag = 0;
		
		for(var j in data_json[i])
		{
			data_single[flag] = data_json[i][j];
			
			if(j == "准时率")
			{
				add_group(data_single[flag - 5],check_out_date(data_single[flag - 1],data_single[flag - 2]));	
			}
			flag ++;
		}
	}
	
	data_single =[];
	
	for( i in data_json)
	{
		tr_info += "<tr align='center'> <th class = 'table_note_left' height='23' scope='row'>" + i + "</th>";
		flag = 0;
		
		for( j in data_json[i])
		{
			data_single[flag] = data_json[i][j];
			
			if(i == 0)
			{
				data_type[type_index++] = j;
			}
			
			if(flag != 0)
			{
				if(j == "准时率")
				{
					tr_info += "<td>" + get_prob(data_single[flag - 5]) + "</td>";
				}
				else if(j == "状态")
				{
					tr_info += "<td>" + check_task(data_single) + "</td>";
				}
				else
				{
					tr_info += "<td>" + data_json[i][j] + "</td>";
				}
			}
			
			flag ++;
			//console.log("i = " + i + " j = " + j + " data_json[i][j] = " + data_json[i][j]);
		}
		
		tr_info += "</tr>";
	}
		
	var tr_type = "<tr align='center'> <th class = 'table_note_left' height='23' scope='row'>编号</th>";

	for( i=1;i< data_type.length; i++)
	{
		tr_type += "<td >" + data_type[i] + "</td>";
	}
	
	tr_type += "</tr>";
	$("#note").append(tr_type);
	$("#note").append(tr_info);

}

function updateData()
{
	$("#today").text(year + "年" + month + "月" + day + "日");
	$("#num1").text(data_num[0] + "件");
	$("#num2").text(data_num[1] + "件");
	$("#num3").text(data_num[2] + "件");
	
	$("#note tbody tr:gt(1)").each(function(key,value)
	{
		if(value.cells[10].innerHTML != "已完成")
		{
			if(check_out_date(value.cells[5].innerHTML,data_date))
			{
				data_today_begin.push(value.cells[1].innerHTML);
			}
			
			if(check_out_date2(value.cells[7].innerHTML,data_date))
			{
				data_today_end.push(value.cells[1].innerHTML);
			}
		}
	});
	
	var aa = "";
	var bb = "";
	
	for(var i in data_today_begin)
	{
		aa += data_today_begin[i] + " ";
	}
	
	for(i in data_today_end)
	{
		bb += data_today_end[i] + " ";
	}
	
	$("#today_begin").text(aa);
	$("#today_end").text(bb);
}

function check_task(data_single)
{
	var date_rule_begin = data_single[5];
	var date_real_begin = data_single[6];
	var date_rule_end = data_single[7];
	var date_real_end = data_single[8];
	
	if(date_real_end != "")
	{
		console.log(" data_num[2]" + data_num[2]);
		data_num[2] ++;
		return "已完成";
	}
	else
	{
		if(date_real_begin != "")
		{
			data_num[1] ++;
			return "进行中";
		}
		else
		{
			data_num[0] ++;
			return "未开始";
		}
	}
}

function check_out_date2(real,rule)
{
	if(real == "" || rule == "")
	{
		return false;
	}
	
	var real_data = real.split("/");
	var rule_data = rule.split("/");
	
	if(real_data.length != 3 || rule_data.length != 3)
	{
		//alert("日期有误！");
		return false;
	}
	
	for(var i  in rule_data)
	{
		if(rule_data[i] != real_data[i])
		{
			return false;
		}
	}
	
	return true;
}

function check_out_date(real,rule)
{
	if(real == "" || rule == "")
	{
		return false;
	}
	
	var real_data = real.split("/");
	var rule_data = rule.split("/");
	
	if(real_data.length != 3 || rule_data.length != 3)
	{
		//alert("日期有误！");
		return false;
	}
	
	for(var i  in rule_data)
	{
	console.log("ddddddd " + rule_data[i] + " " + real_data[i] );
		if(rule_data[i] != real_data[i])
		{
			return false;
		}
	}
	
	return true;
}

function add_group(name,value)
{
	var ok = false;
	
	for(var i in data_name)
	{
		if(data_name[i][0] == name)
		{
			ok = true;
			
			if(value)
			{
				data_name[i][1] ++;
				console.log("data_name: " + data_name);
			}
			else
			{
				data_name[i][2] ++;
				console.log("data_name: " + data_name);
			}
		}
	}
	
	if(!ok)
	{
		if(value)
		{
			data_name.push([name,1,0])
		}
		else
		{
			data_name.push([name,0,1])
		}
	}
}

function get_prob(name)
{
	for(var i in data_name)
	{
		if(data_name[i][0] == name)
		{
			return (data_name[i][1]/(data_name[i][1] + data_name[i][2])).toFixed(2);
		}
	}
	
	return 0;
}

function show(flag)
{
	var type = "";
	
	switch(flag)
	{
		case 0:
			type = "未开始";
			break;
		case 1:
			type = "进行中";
			break;
		case 2:
			type = "已完成";
			break;
		case 3:
			type = "today_begin";
			break;
		case 4:
			type = "today_end";
			break;
		default :
			break;
	}
	
	$("#note tbody tr:gt(1)").each(function(key,value)
	{
		$("#note tbody tr:eq(" + (key + 2) +")").removeClass("select");
		
		if(value.cells[10].innerHTML == type)
		{
			$("#note tbody tr:eq(" + (key + 2) +")").addClass("select");
		}
		
		if(value.cells[10].innerHTML != "已完成")
		{
			if((type == "today_begin") && check_out_date(value.cells[5].innerHTML,data_date))
			{
				$("#note tbody tr:eq(" + (key + 2) +")").addClass("select");
			}
			
			if((type == "today_end") && check_out_date2(value.cells[7].innerHTML,data_date))
			{
				$("#note tbody tr:eq(" + (key + 2) +")").addClass("select");
			}
		}
	})

}



















