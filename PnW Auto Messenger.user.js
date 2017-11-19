// ==UserScript==
// @name         PnW Auto Messenger
// @namespace    https://politicsandwar.com
// @version      0.1
// @description  Messenging Script for PnW
// @author       Praximus Cladius
// @match        https://politicsandwar.com/*
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==
/*jshint sub:true*/
var vdebug, nationLeader, nationName, leader2, nations;
vdebug = $_GET('debug');
getNationLeader();
parseTable();

function $_GET(param) {
	var vars = {};
	window.location.href.replace(location.hash, "").replace(
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function(m, key, value) { // callback
			vars[key] = value !== undefined ? value : "";
		}
	);

	if (param) {
		return vars[param] ? vars[param] : null;
	}
	return vars;
}

function debug(name,data,parm) {
	if(parm) {
		console.log(name+": "+ data+"\n");
	}
}

//Function to captitalize strings - http://stackoverflow.com/a/4878800
function toTitleCase(str)
{
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

//Saves nation name to a variable
function getNationName(){
	$.get("https://politicsandwar.com/nation/", function(response) {
		var data = $.parseHTML(response);
		if($(response).find("li:contains('Login')").length !== 0) {
			GM_deleteValue("nationName");
		} else {
			var nID = $(data).find("td")[1];
			var nationName = $(nID).text();
			debug("Nation Name",nationName,vdebug);
			GM_seteValue("nationName",nationName);
		}
	});
}

function getNationLeader(){
    $.get("https://politicsandwar.com/nation/", function(response) {
        var data = $.parseHTML(response);
        if($(data).find("li:contains('Login')").length !== 0) {
            GM_deleteValue("nationLeader");
        } else {
            var LID = $(data).find("td")[3];
            var nationLeader = $(LID).text();
            GM_setValue("nationLeader",nationLeader);
        }
    });
}


$('input[name="subject"]').val("Guinness - Strength and Unity!");
$('textarea[name="body"]').val("Welcome to P&W \n\n \
On behalf of Guinness, we would like to invite you to join our alliance. Guinness is a proud, close knit alliance that is centered around Unity, Strength, Prosperity, and Community. We believe in doing things right the first time. Once you join, and walk through the door, you are one of us. And we will always have your back. \
\n \
Guinness Benefits: \n\
- Experienced Leadership \n\
- Active, Vibrant Community and Discord Channel \n\
- Low Alliance Taxes \n\
- We will assist you in getting your first city. (6 Grants of 500k over 2 weeks) \n\
- We offer Interest free loans to all members.* \n\
- We have the James Economic Program that helps builds your nation fast. \n\
- We have The New Stout Mentoring Program to help you get settled in the game. \n\
- Democratic process for all Legislative affairs \n\
- Guinness is very active in Orbis Politics \n\
- Protection from raiders & rogues \n\
\n \
Apply by following below:\n \
1. First, visit Guinness in-game and apply here: https://politicsandwar.com/alliance/id=4340 \n\
2. Logon to our discord server, and notify any Gov member for approval. Once approved, you will then be masked as a member of Guinness. \n\
 \n\
Whether you decide to join Guinness or not, we wish you the best in your future endeavors. \n\
 \n\
Thank you for your time, \n\
"+GM_getValue("nationLeader"));

function parseTable() {
    var rows = [];
    var headerText = [];
    var $headers = $("th");

    var $rows = $(".nationtable > tbody > tr");
    var totalRows = $rows.length;

    for (var rowIndex = 0; rowIndex < totalRows; ++rowIndex) {
        var currentRow = $($rows[rowIndex]);
        var $cells = currentRow.find("td");
        rows[rowIndex] = {};
        var totalCells = $cells.length;

        for (var cellIndex = 0; cellIndex < totalCells; ++cellIndex) {
            var currentCell = $($cells[cellIndex]);
            var cellData = currentCell.text();
            var cellReplace = cellData.replace(/(\n)/g,",");
            var cellSplit = cellReplace.split(",");
            if(cellSplit[3] === "" || cellSplit[3] === "undefined") {
                return true;
            } else if(cellSplit[3] !== "" || cellSplit[3] !== "undefined") {
                var cellLeader = $.trim(cellSplit[3]).replace(/ /g,"_");
                if($.trim(cellSplit[3]) == GM_getValue("nation_"+cellLeader+"_name")) {
                   currentRow.remove();
                }
            }
                        /*$.each(nations, function(index, nation1) {
                $.each(nation1, function(index, data) {
                    if(data["Alliance"] == "None") {
                        var natLead = data["Nation/Leader"];
                        var natLeadData = natLead.replace(/(\n)/g,",");
                        var natLeadSplit = natLeadData.split(",");
                        var natLead1 = nationSplit[3].trim();
                        var natLead2 = nationSplit[3].trim().replace(/ /g,"_");
                        //if(natLead1 == currentCell.text();
                        //if(GM_getValue("nation_"+natLead2+"_messaged") === true) {
                    }
                });
            });*/

            //console.log(rowIndex+currentCell.text());
            if(headerText[cellIndex] === undefined) {
                headerText[cellIndex] = $($headers[cellIndex]).text();
            }
            rows[rowIndex][headerText[cellIndex]] = currentCell.text();
        }
    }
    nations = {
        "nation": rows
    };
    return nations;
}
//console.log(nations);

$('#rightcolumn > table').before('<div class="nationsMessaged"><span style="display:block;margin:auto;font-weight:bold;text-decoration:underline;padding-bottom:5px;text-align:center;">Nations Messaged</span><pre></pre></div>');
var nIndex = 0;
$.each(nations, function(index, nation1) {
   $.each(nation1, function(index, data) {
       //console.log(data);
       if(data["Alliance"] == "None") {
           var text = data["Nation/Leader"];
           var location = data["Continent"];
           var color = data["Color"];
           var created = data["Date Created"].replace(" ◆","");
           var nationData = text.replace(/(\n)/g,",");
           var nationSplit = nationData.split(",");
           var nation = nationSplit[1].trim();
           var leader = nationSplit[3].trim().replace(/ /g,"+");
           var leader2 = nationSplit[3].trim().replace(/ /g,"_");
           if(GM_getValue("nation_"+leader2+"_messaged") === true) {
               $('.nationsMessaged pre').append(nation+"\t"+nationSplit[3].trim()+"\t"+created+"\t"+color+"\t"+location+"\n");
               debug(leader2,GM_getValue("nation_"+leader2+"_messaged"),vdebug);
           } else if (GM_getValue("nation_"+leader2+"_messaged") === "undefined" || GM_getValue("nation_"+leader2+"_messaged") === "" || typeof GM_getValue("nation_"+leader2+"_messaged") === "undefined") {
               debug(leader2,GM_getValue("nation_"+leader2+"_messaged"),debug);
               //$('.nationsMessaged pre').append(nation+"\t"+nationSplit[3].trim()+"\t"+created+"\t"+color+"\t"+location+"\n");
               ++nIndex;
               return true;
           } else {
               debug(leader2,GM_getValue("nation_"+leader2+"_messaged"),vdebug);
               //$('.nationsMessaged pre').append(nation+"\t"+nationSplit[3].trim()+"\t"+created+"\t"+color+"\t"+location+"\n");
               ++nIndex;
               return true;
           }
           //console.log(nation+"\t"+leader+"\t"+created+"\t"+color+"\t"+location);
           /*recruits.push({"nation": nation, "leader": leader, "created": created, "continent": location, "messaged":false});
           $.ajax( {
               type: 'GET',
               url: 'https://guinness.dev/recruit.php?data='+nation+'-'+leader+'-'+created+'-'+location+'-'+false,
               dataType: 'json',
               success: function(response) {
                   if(response['status'] == 'invalid') {
                       console.log(response);
                   } else {
                       console.log(response);
                   }
               }
           });*/
       }
   });
});
debug("Index: ",nIndex,debug,vdebug);
var url = document.URL;
var bits = url.split('/');
if(bits[3] == "inbox" || bits[4] == "message") {
    var bit = bits[5].split('=');
    var messagedLeader = bit[1].replace("+","_");
    var messagedLeader2 = bit[1].replace("+"," ");
    GM_setValue("nation_"+messagedLeader+"_messaged",true);
    GM_setValue("nation_"+messagedLeader+"_name",messagedLeader2);
    console.log(messagedLeader+' - '+GM_getValue("nation_"+messagedLeader+"_messaged")+" - "+GM_getValue("nation_"+messagedLeader+"_name"));
}
$('input[name="sndmsg"]').click(function(){
    GM_setValue("nation_"+messagedLeader+"_messaged",true);
});
