// Inlined style because found no easy way to inject a stylesheet.

var style = "<style type='text/css'>body{padding:0 0 0;margin:0;font-size: 62.5%;width:100%}table{width:100%}#report_header{border-bottom:1px solid #333; margin-bottom:10px;}#report_footer{border-top:1px solid #333; margin-top:10px;}table tr,table td{font-size:0.8em;font-family:'Lucida Grande','Trebuchet MS','Arial',sans-serif;width:33.3%}.left_section,.section{text-align:left}.center_section{text-align:center}#report_footer.center_section{font-size:0.8em}.right_section{text-align:right}</style>";

exports.footer = function() {
  var template = style + "<table id='report_footer'><tr><td class='left_section'>{{custom_data.footer.title_left}}</td><td class='center_section'>{{{custom_data.footer.title_center}}}</td><td class='right_section'>Page <span class='page'>{{custom_data.footer.pageNum}}</span> of <span class='topage'>{{custom_data.footer.numPages}}</span></td></tr></table>";
  return template;
};

exports.header = function() {
  var template = style + "<table id='report_header'><tr><td class='section'>{{custom_data.header.title_left}}</td><td class='center_section'>{{custom_data.header.title_center}}</td><td class='right_section'>{{custom_data.header.title_right}}</td><tr></table>";
  return template;
};


