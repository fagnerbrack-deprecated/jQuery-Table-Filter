/*!
 * jQuery Table Filter 1.0.2 (jQuery 1.7+)
 * Fagner Martins Brack <fagnerbrack.com>
 * MIT license
 * https://github.com/FagnerMartinsBrack/jQuery-Table-Filter
 */
(function( $, undefined ) {
	$.fn.tableFilter = function(args) {
		var options = $.extend({
			
			//delay to apply the filter after typing (if the table has a huge number of content)
			delay: 1000,
			
			//Verifies if jQuery Table Filter should ignore the case
			ignoreCase: false,
			
			//Message when there's no result
			emptyMessage: "There's no result to show"
			
		}, args);
		
		function option(key) {
			return options[key];
		}
		
		/**
		 * @param colNumber The number of TDs in the table's thead
		 * @returns {jQuery} A jQuery reference to the new TR that will have the filters
		 */
		function getFilterTR(colNumber) {
			var i = 0,
				inputClasses = option('inputClasses'),
				trClasses = option('trClasses'),
				thClasses = option('thClasses'),
				columns = option('columns'),
				str = [];
			
			str.push("<tr class='" + (typeof trClasses === "string" ? trClasses : "") + "'>");
				for(; i<colNumber; i++) {
					str.push("<th class='" + (typeof thClasses === "string" ? thClasses : "") + "'>");
						if( !$.isArray(columns) || !columns.length || columns.contains(i) ) {
							str.push("<input type='text' class='" + (typeof inputClasses === "string"? inputClasses : "") + "'/>");
						}
					str.push("</th>");
				}
			str.push("</tr>");
		return $( str.join("") );
		}
		
		/**
		 * @param colNumber Greater number of TDs in the table (to set the colspan)
		 * @returns {jQuery} A jQuery reference to the TR that will appear in the footer when a filter shows no TR
		 */
		function getFooterTR(colNumber) {
			var str = [];
			str.push("<tr class='filter-info'>");
				str.push("<td colspan='" + colNumber + "'>");
					str.push( option("emptyMessage") );
				str.push("</td>");
			str.push("</tr>");
		return $( str.join("") );
		}
		
		/**
		 * Store the TD index to avoid a DOM check every time
		 */
		function eachTDs() {
			var $td = $(this);
			$td.data( "tablefilter-index", $td.index() );
		}
		
		/**
		 * Given a jQuery event object, return false if the key pressed matches with the map
		 * 
		 * @param {Object} The Event Object
		 */
		function acceptKey(e) {
			return !(e.keyCode in {
				16: "shift",
				17: "control",
				18: "alt",
				32: "space"
			});
		}
		
		/**
		 * @param $customTR jQuery reference to the new TR that will have the filters
		 * @param $bodyTRs jQuery reference to the table
		 * 
		 * @returns {jQuery} The $customTR as a jQuery Object
		 */
		function bind( $customTR, $table ) {
			var $bodyTRs = $table.find("tbody tr"),
				$bodyTDs = $bodyTRs.find("td").each(eachTDs),
				$headTHs = $customTR.find("th"),
				$allInputs = $headTHs.find("input"),
				colNumber = $headTHs.length,
				ignoreCase = option("ignoreCase"),
				delay = option("delay");
			
			$headTHs.each(function( index, element ) {
				
				function _applyFilter() {
					var $tfoot, $infoTR,
						$TRsToHide = $();
					
					show($bodyTRs);
					
					//Iterate between all inputs and filters each respective column
					$allInputs.each(function(_i) {
						var index,
							$input = $(this),
							inputVal = $input.val().trim();
						
						if(inputVal) {
							
							//Get the index of the TD not the input (cause it is possible that not all TDs have inputs)
							index = $input.parent().index();
							
							$bodyTDs.each(function() {
								var $thisTD = $(this),
									_index = $thisTD.data("tablefilter-index");
								
								if( _index === index ) {
									var innerText = $thisTD.text().trim();
									
									//If it did'nt match...
									if( !compare(innerText, inputVal, ignoreCase) ) {
										
										//...Add to hide the TR of this TD
										$TRsToHide = $TRsToHide.add( this.parentNode );
										
									}
								}
							});
						}
					});
					
					//Hide every marked TR
					hide($TRsToHide);
					
					//Verifies if there's no TR to show
					$tfoot = $table.find("tfoot:last");
					if( !$tfoot.length ) {
						$tfoot = $("<tfoot />").appendTo( $table.find('tbody:last').parent() );
					}
					
					$infoTR = $tfoot.find("tr.filter-info");
					if( !$bodyTRs.filter(":visible").length ) {
						if( !$infoTR.length ) {
							$tfoot.append( getFooterTR(colNumber) ).show();
						} else {
							$infoTR.show();
						}
					} else {
						$infoTR.hide();
					}
				}
				
				//Get the input of this TD
				//Change event to keyup. Sometimes a backspace keydown caused the input to be cleared after the code has been executed
				$(this).find("input").bind( "keyup.tablefilter", function(e) {
					if( acceptKey(e) ) { //Verifies if the typed key is acceptable in the filter
						var $input = $(this),
							filterTimeout = $input.data("tablefilter-timeout");
						
						if( filterTimeout !== undefined ) {
							clearTimeout(filterTimeout);
						}
						
						//Set the timeout only if the delay is greater than zero
						if( delay > 0 ) {
							$input.data( "tablefilter-timeout", setTimeout(_applyFilter, delay) );
						} else {
							_applyFilter();
						}
					}
				});
			});
		return $customTR.data( "tablefilter-tr", true );
		}
		
		/**
		 * Add a flag to the TRs that will be hidden and hide it
		 * 
		 * @param {jQuery} A jQuery Object with the TRs to be hidden
		 */
		function hide($TRs) {
			$TRs.not(":hidden").each(function() {
				var $tr = $(this)
					.data( "tablefilter-hide", true );
				
				$tr.find("input, select, textarea").each(function() {
					var $input = $(this);
					if( !$input.prop("disabled") ) {
						$input.data( "tablefilter-disabled", true ).prop( "disabled", true );
					}
				});
				
			$tr.hide();
			});
		}
		
		/**
		 * Show the given TRs
		 * 
		 * @param {jQuery} A jQuery Object with the TRs to be hidden
		 */
		function show($TRs) {
			$TRs.each(function() {
				var $tr = $(this);
				
				//Remove the flag of the hidden and disabled elements
				$tr.find("input, select, textarea").each(function() {
					var $input = $(this);
					if($input.data("tablefilter-disabled")) {
						$input.prop( "disabled", false ); //Just to clarify we should not use removeProp on native properties such as disabled
					}
				});
				
				//Remove the flag of the hidden TRs and show it
				if($tr.data("tablefilter-hide")) {
					$tr.removeData("tablefilter-hide");
					$tr.show();
				}
			});
		}
		
		/**
		 * Separate the quoted search from the general search
		 * 
		 * @param {String} str The string to be tested
		 * @returns {Array}
		 */
		function splitQuotes(str) {
			var matches,
				reg = new RegExp("([ ]?\")([^\"*]*)(\"[ ]?)", "g"),
				ret = [];
			
			while( (matches = reg.exec(str)) !== null ) {
				ret.push({
					0: matches[0],
					1: matches[2]
				});
			}
		return ret;
		}
		
		/**
		 * Split to treat each search as a separate one
		 * 
		 * @param {String} values The content of the search
		 * @returns {String} An array with each independent search
		 */
		function splitValues(values) {
			
			var i, trimmedVal,
				ret = [],
				quotes = splitQuotes(values);
			
			//Remove double quote
			for(i = 0; i<quotes.length; i++) {
				values = values.replaceAll( quotes[i][0], " " );
			}
			
			//Prepare the return
			if( trimmedVal = values.trim() ) {
				ret = trimmedVal.split(" ");
			}
			
			for(i = 0; i<quotes.length; i++) {
				ret.push( quotes[i][0].trim() );
			}
			
		return ret;
		}
		
		/**
		 * Comparator method to check if the result of the filter matches with the column text
		 * 
		 * @param {String} text The innerHTML of the TD
		 * @param {String} val The typed value to filter this column
		 * @param {Boolean} ignoreCase If the compare should be case-sensitive
		 * @returns {Boolean} If the values match with the compare rule within the given text
		 */
		function compare( text, values, ignoreCase ) {
			var val, l,
				c = 0,
				i = 0,
				valArray = splitValues(values);
			
			for(; i<valArray.length; i++) {
				
				val = valArray[i];
				l = val.length;
				
				if ( l >= 2 && val.substring(0, 1) === "\"" && val.substring(l - 1, l) === "\"" ) {
					
					val = val.substring(1, l - 1);
					if( contains(text, val, ignoreCase) ) {
						c++;
					}
					
				} else if( text.contains(val, ignoreCase) ) {
					c++;
				}
			}
		return c === valArray.length;
		}
		
		/**
		 * Check if the value matches with any word inside the string
		 * 
		 * @param {String} text The content of the TD
		 * @param {String} val The value to be compared
		 * @param {Boolean} ignoreCase if the compare should be made ignoring the case
		 * @returns {Boolean} If the given val is contained inside the text
		 */
		function contains( text, val, ignoreCase ) {
			
			function _hasMatch(index) {
				var matchLeft = index - 1 === -1 || text.substring( index - 1, index ) === " ",
					matchRight = index + val.length >= text.length || text.substring( index + val.length, index + val.length + 1 ) === " ";
				
				return matchLeft && matchRight;
			};
			
			return ignoreCase ? _hasMatch( text.toUpperCase().indexOf(val.toUpperCase()) ) : _hasMatch( text.indexOf(val) );
		};
		
		$(this).each(function() {
			var $table = $(this),
				$thead = $table.find("thead:first"),
				colNumber = $thead.find("tr:last th").length,
				$customTR = bind( getFilterTR(colNumber), $table ),
				$lastHeadTR = $thead.find("tr:last");
			
			//If a tr created by another instance of this plugin already exists, remove it.
			if( $lastHeadTR.data("tablefilter-tr") ) {
				$lastHeadTR.remove();
			}
			
			//Append the generated TR to the head
			$thead.append($customTR);
		});
	return this;
	};
})(jQuery);