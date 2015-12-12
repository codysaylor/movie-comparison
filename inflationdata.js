
// ***********************************************************************************
// ********************** Crunches Inflation based on CPI Index **********************
// ***********************************************************************************
	
function calculateInflation(data, dollars, target){
      var target_data = dollars; //parameter variable, money calculating inflation of
      var found = false;
      var indexA = 0;
      var indexB = 0;
      var percentage = 0;
      var new_dollar = parseFloat(target_data);
      
      
      // Find index of year need to inflate
      for (var i=0; i < data.length && found!==true; i++){
            var a = data[i][0].indexOf(target); 
            if (a==0){
                indexB = data[i][1]; //NESTED arrays [][]
                found = true;
            }
        }
        
        //Calculate new inflated dollar amount
        indexA = data[0][1];
        percentage = (indexA - indexB)/indexB;
        new_dollar = percentage*parseFloat(target_data) + parseFloat(target_data);
        return new_dollar; 
}




// ***********************************************************************************
// ***************** Adds Commas to numbers, Courtesy cwestblog.com ******************
// ***********************************************************************************
   
function addCommas(intNum) {
  return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}   //from: http://cwestblog.com/2011/06/23/javascript-add-commas-to-numbers/
      
     
// ***********************************************************************************
// *************************** Turns Inflation On and Off ****************************
// *********************************************************************************** 
      
function OnOff(){
         if($("#inflation").hasClass("turnOFF")){
                //Switch button class
                $("#inflation").removeClass("turnOFF");
                $("#inflation").addClass("turnON");
                
                //Turns on class to push initial value off screen
                $("#budget1").toggleClass("offscreen");
                $("#budget2").toggleClass("offscreen");
                $("#revenue1").toggleClass("offscreen");
                $("#revenue2").toggleClass("offscreen");
             
            }else{ 
                //Switch button class
                $("#inflation").removeClass("turnON");
                $("#inflation").addClass("turnOFF");
                
                //Turns off class to push initial value off screen
                $("#budget1").removeClass("offscreen");
                $("#budget2").removeClass("offscreen");
                $("#revenue1").removeClass("offscreen");
                $("#revenue2").removeClass("offscreen");
                
                //Removes calculated inflation value
                $("#n_budget1").text("");
                $("#n_budget2").text("");
                $("#n_revenue1").text("");
                $("#n_revenue2").text("");
                
            }
}






// ***********************************************************************************
// ******************* Resize the Graph Bars (Copied from main.js) *******************
// *********************************************************************************** 


function GrowBars(budget1, budget2, revenue1, revenue2){
	// if budget1 > all
	if (budget1 > revenue1 && budget1 > revenue2 && budget1 > budget2) {
		var longerBudget = '100%';
		var shorterBudget = (1*(budget2/budget1))*100+'%';
		$('.graph-budget1').css('width', longerBudget);
		$('.graph-budget2').css('width', shorterBudget);
		
		// calc revenue
		var rev1 = (revenue1/budget1)*100+'%';
		var rev2 = (revenue2/budget1)*100+'%';
		$('.graph-revenue1').css('width', rev1);
		$('.graph-revenue2').css('width', rev2);
	}
	
	// if budget2 > all
	else if (budget2 > revenue1 && budget2 > revenue2 && budget2 > budget1) {
		var longerBudget = '100%';
		var shorterBudget = (1*(budget1/budget2))*100+'%';
		$('.graph-budget1').css('width', shorterBudget);
		$('.graph-budget2').css('width', longerBudget);
		
		// calc revenue
		var rev1 = (revenue1/budget2)*100+'%';
		var rev2 = (revenue2/budget2)*100+'%';
		$('.graph-revenue1').css('width', rev1);
		$('.graph-revenue2').css('width', rev2);
	}
	
	// if revenue1 > all
	else if (revenue1 > budget1 && revenue1 > budget2 && revenue1 > revenue2) {
		var longerRevenue = '100%';
		var shorterRevenue = (1*(revenue2/revenue1))*100+'%';
		$('.graph-revenue1').css('width', longerRevenue);
		$('.graph-revenue2').css('width', shorterRevenue);
		
		// calc budget
		var budget1 = (budget1/revenue1)*100+'%';
		var budget2 = (budget2/revenue1)*100+'%';
		$('.graph-budget1').css('width', budget1);
		$('.graph-budget2').css('width', budget2);
		
	// if revenue2 > all
	} else if (revenue2 > budget1 && revenue2 > budget2 && revenue2 > revenue1) {
		var longerRevenue = '100%';
		var shorterRevenue = (1*(revenue1/revenue2))*100+'%';
		$('.graph-revenue1').css('width', shorterRevenue);
		$('.graph-revenue2').css('width', longerRevenue);
		
		// calc budget
		var budget1 = (budget1/revenue2)*100+'%';
		var budget2 = (budget2/revenue2)*100+'%';
		$('.graph-budget1').css('width', budget1);
		$('.graph-budget2').css('width', budget2);
	} else {
		// Didn't assess which number was highest correctly...
	}

} // End if both movies are selected
     
      
// ***********************************************************************************
// ******************** Main Inflation function, call JSON file **********************
// ***********************************************************************************

function Click_Button2() {
    $.get("CPI_data.json",
    function(data) {
        
        //Pull year of movie1
        if ($(".released1").text().length == 14){
        var tar1 = $(".released1").text().substring(10,14); 
        } else { var tar1 = "2015"}
        var target1 = tar1 + "-12-31"; //year target
        
        //Pull year of movie2
        if ($(".released2").text().length == 14){
        var tar2 = $(".released2").text().substring(10,14); 
        } else { var tar2 = "2015"}
        var target2 = tar2 + "-12-31"; //year target
        
        //Replace first number of budget
        var dollar_b1 = $("#budget1").text(); 
        
        if (dollar_b1 != "N/A"){
            dollar_b1 = parseInt(dollar_b1.replace(/[^0-9]/g, ''));   //remove all non numbers
            var new_dollar_b1 = calculateInflation(data.dataset.data, dollar_b1, target1);
                new_dollar_b1 = new_dollar_b1.toFixed(0);   //get rid of decimal
                new_dollar_b1 = addCommas(new_dollar_b1);  //add commas
               
    
            $("#n_budget1").text("$"+new_dollar_b1); //replace data in html
        } else {$("#n_budget1").text("N/A");}
            
            

        
        
        //Replace second number of budget
        var dollar_b2 = $("#budget2").text();
        
        //do following depending on if N/A or number
        if (dollar_b2 != "N/A"){
            dollar_b2 = parseInt(dollar_b2.replace(/[^0-9]/g, ''));   //remove all non numbers
            var new_dollar_b2 = calculateInflation(data.dataset.data, dollar_b2, target2);
            new_dollar_b2 = new_dollar_b2.toFixed(0);   //get rid of decimal
            new_dollar_b2 = addCommas(new_dollar_b2);  //add commas
            $("#n_budget2").text("$"+new_dollar_b2); //put data in new span in html
        
        } else {$("#n_budget2").text("N/A");}
        
        
        //Replace first number of profits
        var dollar_r1 = $("#revenue1").text(); 
        
        //do following depending on if N/A or number
        if (dollar_r1 != "N/A"){
            dollar_r1 = parseInt(dollar_r1.replace(/[^0-9]/g, ''));   //remove all non num
            var new_dollar_r1 = calculateInflation(data.dataset.data, dollar_r1, target1);
            new_dollar_r1 = new_dollar_r1.toFixed(0);   //get rid of decimal
            new_dollar_r1 = addCommas(new_dollar_r1);  //add commas
            $("#n_revenue1").text("$"+new_dollar_r1); //put data in new span in html
            
        } else {$("#n_revenue1").text("N/A");}
        
        
        //Replace second number of profits
        var dollar_r2 = $("#revenue2").text(); 
        //do following depending on if N/A or number
        if (dollar_r2 != "N/A"){
            dollar_r2 = parseInt(dollar_r2.replace(/[^0-9]/g, ''));   //remove all non
            var new_dollar_r2 = calculateInflation(data.dataset.data, dollar_r2, target2);
            new_dollar_r2 = new_dollar_r2.toFixed(0);   //get rid of decimal
            new_dollar_r2 = addCommas(new_dollar_r2);  //add commas
            $("#n_revenue2").text("$"+new_dollar_r2); //replace data in html
        
        } else {$("#n_revenue2").text("N/A");}
        
        OnOff();
        b1 = parseInt(new_dollar_b1.replace(/[^0-9]/g, ''));
        b2 = parseInt(new_dollar_b2.replace(/[^0-9]/g, ''));
        r1 = parseInt(new_dollar_r1.replace(/[^0-9]/g, ''));
        r2 = parseInt(new_dollar_r2.replace(/[^0-9]/g, ''));
        
        if($("#inflation").hasClass("turnON")){ 
        GrowBars(b1, b2, r1, r2);
        }
        else {
          GrowBars(dollar_b1, dollar_b2, dollar_r1, dollar_r2);  
        }

     }); //end of get method
        
        
} //end of Click_Button2 function
      
      
      
        
      
      
    