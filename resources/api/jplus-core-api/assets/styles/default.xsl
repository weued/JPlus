<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
	<xsl:output method="html" indent="no" omit-xml-declaration="no" encoding="utf-8"
		cdata-section-elements="" media-type="text/html"
		doctype-public="-//W3C//DTD XHTML 1.1//EN"
		doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml11.dtd" />
	<xsl:template match="/docs">
		<html xmlns="http://www.w3.org/1999/xhtml">
		<head>
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
			<title>J+ Core <xsl:value-of select="@version"/> API 文档 </title>
			<link type="text/css" rel="stylesheet" rev="stylesheet" href="assets/styles/default.css" media="all" />
			<script type="text/javascript" src="assets/scripts/jquery.js"></script>
			<script type="text/javascript" src="assets/scripts/jquery-doc.js"></script>
		</head>
		<body id="docs">
			<div id="header">
				<div id="headerMain">
					<h2>XSLT/CSS/JS Written by <a href="http://shawphy.com">Shawphy</a> Translated by <a href="http://www.cn-cuckoo.com/">为之漫笔</a>, <a href="http://shawphy.com">Shawphy</a> and <a href="http://cloudream.name">Cloudream</a>.</h2>
					<h1>J+ Core API 文档</h1>
				</div>
			</div>
			<div id="wrapper">
				<div id="sidebar">
					<xsl:for-each select="cat">
						<h2><xsl:value-of select="@value"/></h2>
						<ul>
							<xsl:for-each select="subcat">
								<li>
									<strong><xsl:value-of select="@value"/></strong>
									<ul>
										<xsl:apply-templates select="function|selector|property"/>
									</ul>
								</li>
							</xsl:for-each>
						</ul>
					</xsl:for-each>
					

				</div>
				<div id="content"></div>
			</div>
		</body>
		</html>
	</xsl:template>

	<xsl:template match="function|selector|property">
		<li>
			<h2>
				<xsl:if test="@return">
					<span>返回值:<xsl:value-of select="@return"/></span>
				</xsl:if>
				<xsl:if test="self::function">
					<xsl:value-of select="@name"/>(<xsl:for-each select="params">
						<xsl:choose>
							<xsl:when test="@optional">
								<em class="optional">[<xsl:value-of select="@name"/>]</em>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="@name"/>
							</xsl:otherwise>
						</xsl:choose>
						<xsl:if test="position() != last()">, </xsl:if>
					</xsl:for-each>)
				</xsl:if>
				<xsl:if test="self::selector">
					<xsl:value-of select="sample"/>
				</xsl:if>
				<xsl:if test="self::property">
					<xsl:value-of select="@name"/>
				</xsl:if>
			</h2>
			<h3>概述</h3>
			<div class="desc">
				<p><xsl:value-of select="desc"/></p>
				<div class="longdesc">
					<pre><xsl:value-of select="longdesc"/></pre>
				</div>
			</div>
			<xsl:if test="params">
				<h3>参数</h3>
				<div>
					<xsl:for-each select="params">
						<h4>
							<strong><xsl:value-of select="@name"/><xsl:if test="@optional"> <em> (可选)</em></xsl:if></strong>
							<span><xsl:value-of select="@type"/></span>
							<xsl:if test="@default"><em>默认值:'<xsl:value-of select="@default"/>'</em></xsl:if>
						</h4>
						<p>
							<xsl:value-of select="desc" disable-output-escaping="yes"/>
						</p>
					</xsl:for-each>
				</div>
			</xsl:if>
			<xsl:if test="option">
				<h3>选项</h3>
				<div>
					<xsl:for-each select="option">
						<h4>
							<strong><xsl:value-of select="@name"/></strong>
							<span><xsl:value-of select="@type"/></span>
							<xsl:if test="@default"><em>默认值:'<xsl:value-of select="@default"/>'</em></xsl:if>
						</h4>
						<p><xsl:value-of select="desc" disable-output-escaping="yes"/></p>
						<xsl:if test="code">
							<pre><code><xsl:value-of select="code"/></code></pre>
						</xsl:if>
					</xsl:for-each>
				</div>
			</xsl:if>
			<xsl:if test="example">
				<div class="example">
					<h3>示例</h3>
					<xsl:apply-templates select="example"/>
				</div>
			</xsl:if>
		</li>
	</xsl:template>

	<xsl:template match="example">
		<xsl:if test="desc">
			<h4>描述:</h4>
			<p><xsl:value-of select="desc"/></p>
		</xsl:if>
		<xsl:if test="css">
			<h5>CSS 代码:</h5>
			<pre><code><xsl:value-of select="css"/></code></pre>
		</xsl:if>
		<xsl:if test="html">
			<h5>HTML 代码:</h5>
			<pre><code><xsl:value-of select="html"/></code></pre>
		</xsl:if>
		<xsl:if test="code">
			<h5>JS 代码:</h5>
			<pre><code><xsl:value-of select="code"/></code></pre>
		</xsl:if>
		<xsl:if test="result">
			<h5>返回值:</h5>
			<pre><code><xsl:value-of select="result"/></code></pre>
		</xsl:if>
	</xsl:template>

</xsl:stylesheet>
