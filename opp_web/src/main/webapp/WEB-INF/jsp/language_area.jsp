<div class="fixed-right-lan-pnl" id="lang_jsp">
    <ul id="langSelectionUl">
        <li class="picker" id="langSelectionArea">
        <select id="langDD" >
            <option>
                <fmt:message key="login.selectLanguage"/>
            </option>
            <option value="en_US" SELECTED>
                <fmt:message key="lang.English"/>
            </option>
            <option value="es_US">
                <fmt:message key="lang.Spanish"/>
            </option>
        </select>
            <a href="javascript:void(0)" class="toggle">
            	<fmt:message key="login.selectLanguage"/>
            	<span class="caret"></span> 
            </a>
            <ul>
                <li>
                	<a href="javascript:void(0)" onClick="langSelection('en_US', 1);">
                		<fmt:message key="lang.English"/>
                    </a>
                </li>
                <li><a href="javascript:void(0)" onClick="langSelection('es_US', 2);">
                		<fmt:message key="lang.Spanish"/>
                	</a>
                </li>
            </ul>
        </li>
    </ul>
</div>
