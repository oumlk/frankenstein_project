<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="xs tei"
    version="2.0">
    
    <!-- <xsl:output method="xml" omit-xml-declaration="yes" indent="yes" /> -->
    
    <xsl:template match="tei:TEI">
        <div class="row">
            <div class="col">
                <h4>About the manuscript page:</h4>
                <xsl:value-of select="//tei:sourceDesc"/>
                <xsl:value-of select="//tei:licence"/> <!-- You can change the way the metadata is visualised as well-->
            </div>
            <div class="col">
                <ul> 
                    <li>Total number of modifications: 
                        <xsl:value-of select="count(//tei:del|//tei:add)" /> <!-- Counts all the add and del elements, and puts it in a list item -->
                    </li>
                    <li>Number of additions: 
                        <xsl:value-of select="count(//tei:add)" /> <!-- Counts all the add elements -->
                    </li>
                    <li>Number of deletions:
                        <xsl:value-of select="count(//tei:del)" /> <!-- Counts all the del elements -->
                    </li>
                    <li>Number of modifications by Percy Shelley:
                        <xsl:value-of select="count(//tei:del[@hand='#PBS'] | //tei:add[@hand='#PBS'])" /> <!-- Counts del and add elements by Percy Shelley -->
                    </li>
                    <li>Number of modifications by Mary Shelley:
                        <xsl:value-of select="count(//tei:del[@hand='#MWS'] | //tei:add[@hand='#MWS'])" /> <!-- Counts del and add elements by Mary Shelley -->
                    </li>
                    <li>Total number of words:
                        <xsl:value-of select="count(//tei:w)" /> <!-- Counts the total number of word elements (replace tei:w with the correct element if different) -->
                    </li>
                </ul>
            </div>
        </div>
        <hr/>
    </xsl:template>
</xsl:stylesheet>
