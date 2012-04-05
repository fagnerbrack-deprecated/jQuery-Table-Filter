/**
 * jQuery Table Filter 1.0 (jQuery 1.7+)
 * (c) 2012-2012 Fagner Martins Brack <fagnerbrack.com>
 * MIT license
 * 
 * jQuery Table Filter
 * Given a table with thead and tbody, jQuery Table Filter creates an input below all TDs of theads that automatically filters the content based on the innerHTML of each TD of the tbody
 * The TRs that don't match with desired filter are hidden and any input inside any TD is disabled (the input is enabled when the TR is visible again)
 * The filter verifies the content splitting each word as it is a different search ("A test" matches with "A - test" and "test A")
 * The only requirement for the use of this plugin is that it is used ONLY in a table with at least a <thead>, <th> and <tbody>
 * It is created a TR that informs the user when a filter did not return any result. It is positioned below the last TR of the tfoot. If there's no tfoot, jQuery Table Filter creates it.
 */
(function($) {
	$.fn.tableFilter = function(args) {
		var options = $.extend({
			inputClasses: undefined, //custom classes that will be set in the filter inputs that will be created
			trClasses: undefined, //custom classes that will be set in the TR(s) that will be created to the filters
			delay: 1000, //delay to apply the filter after typing (if the table has a huge number of content)
			ignoreCase: false, //Verifies if jQuery Table Filter should ignore the case
			emptyMessage: "There's no result to show", //Message when there's no result
			columns: [] //Index of the columns that will be filtered. If not especified consider all columns.
		}, args);
		
		function option(key) {
			var ret = undefined;
			if(key !== undefined) {
				ret = options[key];
			}
		return ret;
		};
		
		/**
		 * @param colNumber The number of TDs in the table's thead
		 * @return A jQuery reference to the new TR that will have the filters
		 */
		function getFilterTR(colNumber) {
			var inputClasses = option('inputClasses');
			var trClasses = option('trClasses');
			var columns = option('columns');
			var str = [];
			str.push("<tr class='" + ($.type(trClasses) === 'string'? trClasses : '') + "'>");
				for(var i = 0; i<colNumber; i++) {
					str.push("<td style='text-align: center; vertical-align: middle; padding: 0; margin: 0;'>");
						if(!$.isArray(columns) || !columns.length || columns.contains(i)) {
							str.push("<input type='text' class='" + ($.type(inputClasses) === 'string'? inputClasses : '') + "'/>");
						}
					str.push("</td>");
				}
			str.push("</tr>");
		return $(str.join(''));
		};
		
		/**
		 * @param colNumber Greater number of TDs in the table (to set the colspan)
		 * @return Um objeto jQuery reference to the TR that will appear in the footer when a filter shows no TR
		 */
		function getFooterTR(colNumber) {
			var str = [];
			str.push("<tr class='syo-filter-info'>");
				str.push("<td colspan='" + colNumber + "'>");
					str.push(options.emptyMessage);
				str.push("</td>");
			str.push("</tr>");
		return $(str.join(''));
		};
		
		/**
		 * Set the .data() in the TDs the value if its index
		 * So you dont need to verify the index via selector
		 */
		function markTDs() {
			var $this = $(this);
			$this.data('filter-index', $this.index());
		};
		
		function acceptKey(e) {
			var accept = true;
			if(e.keyCode in {
				16: 'shift',
				17: 'control',
				18: 'alt',
				32: 'space'
			}) {
				accept = false;
			}
		return accept;
		};
		
		/**
		 * @param $customTR jQuery reference to the new TR that will have the filters
		 * @param $bodyTRs jQuery reference to the table
		 */
		function bind($customTR, $table) {
			var $bodyTRs = $table.find('tbody tr');
			var $bodyTDs = $bodyTRs.find('td').each(markTDs);
			var $headTDs = $customTR.find('td');
			var $allInputs = $headTDs.find('input');
			var colNumber = $headTDs.length;
			$headTDs.each(function(index, element) {
				var $TD = $(this);
				
				//Get the input of this TD
				$TD.find('input').bind('keydown.jQueryTableFilter', function(e) {
					if(acceptKey(e)) { //Verifies if the typed key is acceptable in the filter
						var $input = $(this);
						var ignoreCase = option('ignoreCase');
						var filterTimeout = $input.data('syo_filter_timeout');
						
						if(filterTimeout !== undefined) {
							clearTimeout(filterTimeout);
						}
						
						$input.data('syo_filter_timeout', setTimeout(function() {
							var $TRsToHide = $();
							show($bodyTRs);
							
							//Iterate between all inputs and filters each respective column
							$allInputs.each(function(_i, el) {
								var $input = $(el);
								var inputVal = $input.val().trim();
								var index;
								
								if(inputVal) {
									index = $input.parent().index(); //Get the index of the TD not the input (cause it is possible that not all TDs have inputs)
									$bodyTDs.each(function() {
										var $thisTD = $(this);
										var _index = $thisTD.data('filter-index');
										if(_index === index) {
											var innerText = $thisTD.text().trim();
											
											//If it did'nt match...
											if(!compare(innerText, inputVal, ignoreCase)) {
												$TRsToHide = $TRsToHide.add(this.parentNode); //...Add to hide the TR of this TD
											}
										}
									});
								}
							});
							
							//Hide every marked TR
							hide($TRsToHide);
							
							//Verifies if there's no TR to show
							var $tfoot = $table.find('tfoot:last');
							if(!$tfoot.length) $tfoot = $('<tfoot />').appendTo($table.find('tbody:last').parent());
							
							var $infoTR = $tfoot.find('tr.syo-filter-info');
							if($bodyTRs.filter(':visible').length === 0) {
								if(!$infoTR.length) {
									$tfoot.append(getFooterTR(colNumber)).show();
								} else {
									$infoTR.show();
								}
							} else {
								$infoTR.hide();
							}
						}, option('delay')));
					}
				});
			});
			return $customTR;
		};
		
		function hide($TRs) {
			$TRs.not(':hidden').each(function() {
				//Add a flag to the TRs that will be hidden and hide it
				var $this = $(this);
				$this.data('filter_hide', true);
				$this.find("input, select, textarea").each(function() {
					var $_this = $(this);
					if(!$this.prop("disabled")) {
						$_this.data("filter_disabled", true).prop("disabled", true)
					}
				});
				$this.hide();
			});
		};
		
		function show($TRs) {
			$TRs.each(function() {
				var $this = $(this);
				
				//Remove the flag of the hidden TRs and show it
				if($this.data('filter_hide') === true) {
					$this.removeData('filter_hide');
					$this.show();
				}
				
				//Remove the flag of the hidden and disabled elements
				$this.find("input, select, textarea").each(function() {
					var $_this = $(this);
					if($_this.data("filter_disable") === true) {
						$this.removeProp("disabled");
					}
				});
			});
		};
		
		function splitQuotes(str) {
			var reg = new RegExp('([ ]?")([^"*]*)("[ ]?)', 'g');
			var ret = [];
			var matches = null;
			while((matches = reg.exec(str)) !== null) {
				ret.push({
					0: matches[0],
					1: matches[2]
				});
			}
		return ret;
		};
		
		function splitValues(values) {
			
			//Remove double quote
			var quotes = splitQuotes(values);
			for(var i = 0; i<quotes.length; i++) {
				values = values.replaceAll(quotes[i][0], ' ');
			}
			
			//Prepare the return
			var trimmedVal = values.trim();
			var ret = trimmedVal? trimmedVal.split(' ') : [];
			for(var i = 0; i<quotes.length; i++) {
				ret.push(quotes[i][0].trim());
			}
			
			return ret;
		};
		
		/**
		 * Comparator method to check if the result of the filter matches with the column text
		 * @param {String} text The innerHTML of the TD
		 * @param {String} val The typed value to filter this column
		 * @param {Boolean} ignoreCase If the compare should be case-sensitive
		 */
		function compare(text, values, ignoreCase) {
			var valArray = splitValues(values);
			var c = 0;
			for(var i = 0; i<valArray.length; i++) {
				var val = valArray[i];
				var l = val.length;
				if(l >= 2 && val.substring(0, 1) === '"' && val.substring(l - 1, l) === '"') {
					val = val.substring(1, l - 1);
					if(contains(text, val, ignoreCase)) {
						c++;
					}
				} else if(text.contains(val, ignoreCase)) {
					c++;
				}
			}
			return c === valArray.length;
		};
		
		/**
		 * Check if the value matches with any word inside the string
		 */
		function contains(text, val, ignoreCase) {
			
			function hasMatch(index) {
				var matchLeft = index - 1 === -1 || text.substring(index - 1, index) === ' ';
				var matchRight = index + val.length >= text.length || text.substring(index + val.length, index + val.length + 1) === ' ';
				return matchLeft && matchRight;
			};
			
			return ignoreCase === true? hasMatch(text.toUpperCase().indexOf(val.toUpperCase())) : hasMatch(text.indexOf(val));
		};
		
		$(this).each(function() {
			var $table = $(this);
			var $thead = $table.find('thead:first');
			var colNumber = $thead.find('tr:last th').length;
			var $customTR = bind(getFilterTR(colNumber), $table);
			
			$thead.append($customTR);
		});
	return this;
	};
})(jQuery);