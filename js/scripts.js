$(document).ready(function(){
	$('#arrow1').click(function(){
		$('#page1,#page2').css({
			'right':'100vw'
		});
	});
	$('#arrow2').click(function(){
		$('#page1,#page2').css({
			'right':'0vw'
		});
	})


	var userStockSavedIfAny = localStorage.getItem('lastSymbolSearched');	
	
	if (userStockSavedIfAny !== null){
		getQuotes(userStockSavedIfAny);
	};

	var savedData = '';		


	$('.yahoo-finance-form').submit((event)=>{
		event.preventDefault();
		var symbol = $('#symbol').val();
		getQuotes(symbol);
		savedData = tempSave(savedData,symbol);
		$('#symbol').val('');

	});
	
	$('#savior').click(function(){
		storeData('lastSymbolSearched',savedData);
	})

		function getQuotes(symbol){
			var multipleSymbols = '';
			var url = `http://query.yahooapis.com/v1/public/yql?q=env%20%27store://datatables.org/alltableswithkeys%27;select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22${symbol}%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json`;		
			if (symbol.indexOf(',') !== -1){
				multipleSymbols = symbol.split(',');
			}else{
				multipleSymbols = symbol
			}
			$.getJSON(url,(data)=>{
				var stockInfo = data.query.results.quote;
				if (symbol.indexOf(',') !== -1){
					for(let i = 0; i < stockInfo.length; i++){
						var newRow = addRow(stockInfo[i]);
					}
				}else{
						var newRow = addRow(stockInfo);
				}
			});			
		}
		
		function addRow(data){
			var classChange = '';
			if (data.Change.indexOf('+') == -1){
				classChange = "danger";
			}else{
				classChange = "success";
			}
			var newHTML = '';
				newHTML += `<tr>`
				newHTML += `<td>${data.symbol}</td>`;
				newHTML += `<td>${data.Name}</td>`;
				newHTML += `<td>${data.Ask}</td>`;
				newHTML += `<td>${data.Bid}</td>`;
				newHTML += `<td class="bg-${classChange}">${data.Change}</td>`;
				newHTML += `</tr>`;
			$('#stock-ticker-body').append(newHTML);
			}	

		function storeData(last,data){
			var old = localStorage.getItem(last);
			if (old == null){
				old = '';
				localStorage.setItem(last,data);
			}else{
				localStorage.setItem(last,old +','+data);
			}
		}

		function tempSave(last,data){
			if (last == ''){
				last = data;
			}else{
				last = last + ',' + data;
			}
			return last;
		}
});


// 1. give the user the ability to search for multiple symbols ex (goog,yhoo,msft);
// 2. multiple will brink back an array inside of quote. a single will bring back one object

