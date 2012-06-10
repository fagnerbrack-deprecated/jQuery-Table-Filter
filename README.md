jQuery tableFilter
==================
*Requires [jQuery](http://jquery.com/)*  
*Requires [utils](https://github.com/FagnerMartinsBrack/jQuery-Table-Filter/blob/master/src/utils.js)*

* Given a table with thead and tbody, jQuery Table Filter creates an input below all TDs of theads that automatically filters the content based on the innerHTML of each TD of the tbody  
* The TRs that don't match with desired filter are hidden and any input inside any TD is disabled (the input is enabled when the TR is visible again)  
* The filter verifies the content splitting each word as it is a different search ("A test" matches with "A - test" and "test A")  
* The only requirement for the use of this plugin is that it is used ONLY in a table with at least a &lt;thead&gt;, &lt;th&gt; and &lt;tbody&gt;  
* It is created a TR that informs the user when a filter did not return any result. It is positioned below the last TR of the tfoot. If there's no tfoot, jQuery Table Filter creates it.  

Parameters
----------
Parameters in "[]" are optional:
* {String} [inputClasses] - custom classes that will be set in the filter inputs that will be created
* {String} [trClasses] - custom classes that will be set in the TR(s) that will be created to contain the filters
* {String} [thClasses] - custom classes that will be set in the TH(s) that will be created to contain the filters
* {Number} [timeout=1000] - delay to apply the filter after typing (usefull if the table has a huge number of content)
* {Boolean} [ignoreCase=false] - Verifies if jQuery Table Filter should ignore the case
* {String} [emptyMessage="There's no result to show"] - Message when there's no result (A tfoot will be created if there's none)
* {Array} [columns] - Index of the columns that will be filtered. If not specified or it is an empty array consider all columns.

Usage
-----
<pre>

//Regular usage
$("#table").tableFilter();

//Passing parameters
$("#table").tableFilter({
    timeout: 0,
    columns: [0, 2, 3],
    emptyMessage: "Cannot find any occurences..."
});
</pre>

Changelog
--------
* 1.0.2 - Initial creation of README. Conform code with jQuery code style. Change some internal data/bind namespaces.