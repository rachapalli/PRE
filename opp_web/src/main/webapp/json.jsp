<%@ page contentType="text/html;charset=UTF-8" language="java" session="false" %>
<html>
<head>
    <title></title>
    <script type="text/javascript">
        function prettyJson(json) {

            var pretty = json;
            if (null == json) {
                return '';
            }
            pretty = pretty.split("{").join("<ul>{");
            pretty = pretty.split("}").join("</ul>}");
            pretty = pretty.split("[").join("<ul>[");
            pretty = pretty.split("]").join("]</ul>");
            pretty = pretty.split(",").join(",<br/>");
            return pretty;

        }

        function formatJson() {
            document.getElementById("pretty").innerHTML = prettyJson(document.getElementById("json").value);
        }
    </script>
</head>
<body>
JSON Print Friendly
<input type="text" value="" size="10000" id="json"/>
<br/>
<input type="button" value="Format" name="format" onclick="formatJson()"/>


<span id="pretty">

</span>


</body>
</html>