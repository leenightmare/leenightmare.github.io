# 【编程笔记第四期】 SpringMVC 概述

李坚达	 [众神眷恋的幻想乡TH]() 	2021-12-25  15:49

前言：本公众号为个人作业测试号，主要分享学习知识、动漫资讯等，欢迎关注。



⭕终于到了三大框架的SpringMVC，由于篇幅限制，本期只是简单介绍SpringMVC的内容

##  1.1 SpringMVC 基本说明

SpringMVC是基于spring的， 是spring中的一个模块，做web开发使用的。 springmvc 叫做spring web mvc

说明他是spring的核心技术， 做web开发，springmvc内部是使用mvc架构模式。

SpringMVC 是一个容器， 管理对象的，使用IoC核心技术。 springmvc管理界面层中的控制器对象。

SpringMVC底层也是Servlet。 以Servlet为核心， 接收请求，处理请求。 显示处理结果给用户。

处理用户的请求：

 用户发起请求----SpringMVC---Spring---MyBatis--mysql数据库



## 1.2 SpringMVC中的核心Servlet -- DispatcherServlet

DispatcherServlet 是框架一个Servlet对象。  负责接收请求， 响应处理结果。

DispatcherServlet 他的父类是HttpServlet 

DispatcherServlet 也叫做前端控制器（ front controller）。



SpringMVC是管理控制器对象， 原来没有SpringMVC之前使用 Servlet作为控制器对象使用。现在通过SpringMVC容器创建一种叫做控制器的对象，代替Servlet行驶控制器的角色。功能。



SpringMVC 主要使用注解的方式， 创建控制器对象， 处理请求。



```xml
<servlet>
    <servlet-name>myweb</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <!--自定义配置文件的位置-->
    <init-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:springmvc.xml</param-value>
    </init-param>
    <!--
       表示服务器tomcat创建对象的顺序， 是个整数值， 大于等于0.
       数值越小，创建对象的时间越早。
    -->
    <load-on-startup>1</load-on-startup>
</servlet>


<servlet-mapping>
    <servlet-name>myweb</servlet-name>
    <!--
       url-pattern 作用: 把一些请求交给指定的servlet处理
       使用中央调度器（DispatcherServlet）
       1. 使用扩展名方式， 格式 *.xxx ,  xxx是自定义的扩展名。
          例如  *.do , *.action, *.mvc 等等. 不能使用*.jsp
          http://localhost:8080/myweb/some.do
          http://localhost:8080/myweb/user/list/queryUser.do
          http://localhost:8080/myweb/user/list/list.do

       2. 使用斜杠 "/"
    -->
    <url-pattern>*.do</url-pattern>

</servlet-mapping>
```



## 1.3 springmvc请求的处理过程

简单的处理过程：

用户发起请求some.do--->Tomcat接收了请求---DispatcherServlet--分配MyController(doSome()返回mv对象)--mv显示给用户了。 



省略tomcat

用户some.do--------------DispatcherServlet--------------MyController

如果使用servlet处理请求

用户发起请求--------------------没有其他对象------------------------Servlet



![image-20201027155932057](F:\course\JavaProjects\JavaSE\课堂笔记\pic\image-20201027155932057.png)	



## 1.4  复习

用户发起some.do---DispatcherServlet(Servlet接收请求)---转给MyController

```java
public class DispatcherServlet extends HttpServlet{

	public void service(HttpServletRequest request, HttpServletResponse response){

		if("some.do".equals(request.getURI())){

		//从容器中获取MyController

		MyController c  = ctx.getBean("some"));

		c.doSome();

		} else if( "other.do".equals(request.getURI())){

			OtherController c  = ctx.getBean("other"));

			c.doOther();

		}

	}

}

```



## 1.5 web开发中配置文件的说明

1. web.xml  部署描述符文件 ， 给服务器（tomcat）。 

   作用：服务器在启动的时候，读取web.xml ，根据文件中的声明创建各种对象， 

   ​           根据文件中的声明 知道 请求和servlet等对象的关系。

2. 框架的配置文件， springmvc的配置文件

   作用：声明框架创建的项目中的各种对象， 主要是创建Controller对象的



配置文件的加载顺序和功能

1. tomcat服务器启动， 读取web.xml. 根据web.xml文件中的说明，创建对象。

   ```xml
   <servlet>
           <servlet-name>myweb</servlet-name>
           <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
           <!--自定义配置文件的位置-->
           <init-param>
               <param-name>contextConfigLocation</param-name>
               <param-value>classpath:springmvc.xml</param-value>
           </init-param>
           <!--
              表示服务器tomcat创建对象的顺序， 是个整数值， 大于等于0.
              数值越小，创建对象的时间越早。
           -->
           <load-on-startup>1</load-on-startup>
       </servlet>
   ```

   创建DispatcherServlet他的对象， 会执行init()方法。 在init()方法中会执行 springmvc容器对象创建

   WebApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:springmvc.xml")

   

2. springmvc框架， new ClassPathXmlApplicationContext(）读取springmvc的配置文件。

   ```xml
    <context:component-scan base-package="com.bjpowernode.controller" />
   
       <!--声明视图解析器：帮助处理视图-->
       <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
           <!--前缀：指定视图文件的路径-->
           <property name="prefix" value="/WEB-INF/view/" />
           <!--后缀：视图文件的扩展名-->
           <property name="suffix" value=".jsp" />
       </bean>
   ```

   使用组件扫描器base-package="com.bjpowernode.controller" ，遍历controller包中的所有类，MyController类， 找到这个类中的@Controller， @RequestMapping注解， 就能创建MyContoller对象。

   知道some.do的请求是执行doSome()方法

   以上 1， 2. 都是项目启动的过程， 没有执行任何的用户请求。

   

3. 用户发起请求some.do----DispatcherServlet

   DispatcherServlet里面有 WebApplicationContext 。  WebApplicationContext 里面有MyController对象。

   请求some.do ，DispatcherServlet 就知道是 MyController处理的。

   

## 1.6 SpringMVC内部的执行流程

springmvc内部请求的处理过程：

1. 用户发起请求给DispatcherServlet

2. DispatcherServlet把请求（request）交给了 处理器映射器。

   处理器映射器： springmvc框架中的对象， 需要实现HandlerMapping接口。

   映射器作用： 从springmvc容器中，获取控制器对象（MyController）,把找到的控制器和拦截器对象都放到                处理器执行链对象中，保存，并返回给中央调度器。（MyController controller  = ApplicationContext.getBean()）

   

3. DispatcherServlet把获取到的处理器执行链中的控制器对象，交给了处理器适配器

   处理器适配器：是springmvc框架中的对象， 实现HandlerAdapter接口。

   适配器作用： 执行控制器的方法， 也就是执行MyController.doSome()方法。得到结果ModelAndView

   

4. DispatcherServlet把控制器执行结果mv交给了 视图解析器

   视图解析器： springmvc中的对象，需要实现ViewResolver接口。

   视图解析器作用： 处理视图的， 组成视图的完整路径。 能创建View类型的对象

   

5. DispatcherServlet调用View类的方法， 把Model中的数据放入到request作用域。 执行request.setAttribute(),  对视图执行forward()转发行为， request.getRequestDispather("/show.jsp").forward(request,response)

<img src="F:\course\JavaProjects\JavaSE\课堂笔记\pic\Snipaste_2021-12-26_17-07-18.png" alt="Snipaste_2021-12-26_17-07-18" style="zoom:33%;" />



⭕以上就是本期内容，你学废了吗？遇到其他问题，欢迎在评论区留言哦。

​										--END--

![image-20211226160910708](file://F:\course\JavaProjects\JavaSE\%E8%AF%BE%E5%A0%82%E7%AC%94%E8%AE%B0\pic\image-20211226160910708.png?lastModify=1640509300)