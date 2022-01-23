# 【编程笔记第三期】Spring初步入门

李坚达	 [众神眷恋的幻想乡TH]() 	2021-12-19  12:23

前言：本公众号为个人作业测试号，主要分享学习知识、动漫资讯等，欢迎关注。



⭕本期学习Java最经典框架的简单搭建——Spring！话不多说开始吧

<img src="F:\course\JavaProjects\JavaSE\课堂笔记\pic\tou.jpg" alt="tou" style="zoom: 33%;" />

### 1.1）创建工程，maven项目

模板选择quickstart

### 1.2）添加依赖

在pom.xml中添加下面spring依赖

```xml
<dependency> 
    <groupId>org.springframework</groupId> 
    <artifactId>spring-context</artifactId> 
    <version>5.2.5.RELEASE</version>
</dependency>

```



### 1.3）定义接口与实体类

```java
public interface SomeService {
    void doSome();
    void doOther();
}
public class SomeServiceImpl implements SomeService {
    public void doSome() {
        System.out.println("doSome");
    }
    public void doOther() {
        System.out.println("doOther");
    }
}
```



### 1.4）配置spring配置文件

在resources下创建applicationContext.xml文件，名字自定义，官方推荐applicationContext

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- 注册bean对象
`		<bean />：用于定义一个实例对象。一个实例对应一个 bean 元素。
         id：自定义对象的名称，通过id在代码中使用的对象
         class：类的全限定名称，不能是接口   
     -->
    <bean id="someServiceImpl" class="com.lijad.service.SomeServiceImpl"></bean>
</beans>
```



### 1.5）新建测试

```java
public void test(){
	//指定spring配置文件的位置和名称,从类路径开始，即从编译后的target/classes下开始
    String resource = "applicationContext.xml";
    //创建spring容器对象
    ApplicationContext context = new ClassPathXmlApplicationContext(resource);
	//从spring容器中获取对象，使用id
    SomeService some = (SomeService)context.getBean("someServiceImpl");
    //执行对象的业务方法
    
    service.doSome();
}

```

## 基于XML的DI

注入分类：

* set注入
* 构造注入

### 1）set 注入(掌握)

通过set方法给对象赋值，开发常用

#### 1.1）创建一个有属性的类，要有set方法

```java
public class School{
    private String name;
   	public void setName(String name){this.name = name;}
}
public class Student {
    private String name;
    private Integer age;
    private School school;
    public void setName(String name) {
        this.name = name;
    }
    public void setAge(Integer age) {
        this.age = age;
    }
    public void setSchool(School school){
        this.school = school;
    }
}
```

#### 1.2）在配置文件添加bean

A、简单类型（java基本类型和String）

```xml
<bean id="School" class="com.lijad.pojo.School">
    <!--内部调用了setName、setAge方法-->
    <property name="name" value="嘉应学院"/>
</bean>
<bean id="student" class="com.lijad.pojo.Student">
    <!--内部调用了setName、setAge方法-->
    <property name="name" value="admin"/>
    <property name="age" value="222"/>
    <!--school属于引用类型，看下面-->
</bean>
```

B、引用数据类型

```xml
<bean id="student" class="com.lijad.pojo.Student">
    <!--内部调用了setName、setAge方法-->
    <property name="name" value="admin"/>
    <property name="age" value="222"/>
    <!--套娃。ref的值是bean的id值-->
   	<property name="school" ref="school" />
</bean>
```



### 2）构造注入（理解）

使用构造方法进行赋值

```xml
<bean id = "student" class = "com.lijad.pojo.Student">
	<constructor-arg name="name" value="admin"/>
    <constructor-arg name="age" value="22"/>
    <constructor-arg name="school" ref="school"/>
</bean>
或者
<bean id="student" class="com.lijad.pojo.Student">
    <constructor-arg index="0" value="admin"></constructor-arg>
    <constructor-arg index="1" value="20"></constructor-arg>
    <constructor-arg index="2" ref="school"></constructor-arg>
</bean>
或者 index可以省略，这样的话，必须按照构造方法的定义顺序
<bean id="student" class="com.lijad.pojo.Student">
    <constructor-arg  value="admin"></constructor-arg>
    <constructor-arg  value="20"></constructor-arg>
    <constructor-arg  ref="school"></constructor-arg>
</bean>

```



<constructor-arg />标签中用于指定参数的属性有：

➢ name：指定参数名称。

➢ index：指明该参数对应着构造器的第几个参数，从 0 开始。不过，该属性不要也行，

但要注意，若参数类型相同，或之间有包含关系，则需要保证赋值顺序要与构造器中的参数

顺序一致



### 3）引用类型属性自动注入

#### 3.1）byName 自动注入

当配置文件中被调用者 bean 的 id 值与代码中调用者 bean 类的属性名相同时，

可使用byName 方式，让容器自动将被调用者 bean 注入给调用者 bean。

容器是通过调用者的 bean类的属性名与配置文件的被调用者 bean 的 id 进行比较而实现自动注入的。

```xml
<bean id="student" class="com.lijad.pojo.Student" autowire="byName">
    <!--自动注入，使用语句 autowire = "" -->
    <!--因为student类中的school名和bean的id名相同，所以可以使用byName自动注入-->
    <property name="name" value="admin"/>
    <property name="age" value="222"/>
    <!--使用了自动注入，该句可以省略
		<property name="school" ref="school"/>
	-->
</bean>
<bean id="School" class="com.lijad.pojo.School">
    <property name="name" value="嘉应学院"/>
</bean>

```



#### 3.1） byType 自动注入

根据属性的类型注入

要求：配置文件中被调用者 bean 的 class 属性指定的类

* 要与代码中调用者 bean 类的某引用类型属性类型同源。
* 即要么相同，要么有 is-a 关系（子类，或是实现类）。
* 满足要求的 bean 只能有一个。多于一个，容器就不知该匹配哪一个了。

```xml
以上面的例子为例。
满足要求的bean可以是School、School的子类
```



### 4）为应用指定多个 Spring 配置文件

在开发中spring的配置文件通常是多个，多个配置文件中有一个总文件，总配置文件将各其它子文件通过<import/>引入。在 Java代码中只需要使用总配置文件对容器进行初始化即可。

在总文件中引入：

```xml
<import resource="classpath:com/lijad/dao/spring-dao.xml" />
<import resource="classpath:com/lijad/service/spring-service.xml" />
```

 也可以使用通配符*。但要求使用通配符后不能包含该文件，否则会无限套娃。

```xml
<import resource="classpath:com/lijad/dao/spring-dao*.xml" />
```

⭕以上就是本期内容，你学废了吗？遇到其他问题，欢迎在评论区留言哦。

​										--END--

![image-20211226160910708](file://F:\course\JavaProjects\JavaSE\%E8%AF%BE%E5%A0%82%E7%AC%94%E8%AE%B0\pic\image-20211226160910708.png?lastModify=1640508872)