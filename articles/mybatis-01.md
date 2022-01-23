# 					【编程笔记第二期】MyBatis快速搭建步骤

李坚达	 [众神眷恋的幻想乡TH]() 	2021-11-28  21:06

前言：本公众号为个人作业测试号，主要分享学习知识、动漫资讯等，欢迎关注。



⭕上期我们说到Maven的配置，这期继续学习SSM三大框架之一的Mybatis

![xuexi](F:\course\JavaProjects\JavaSE\课堂笔记\pic\xuexi.jpg)

## 一、前期准备

> 数据库——使用MySQL

* 创建名称为ssm的数据库

* 创建一个学生信息表

```mysql
create database ssm;
create table student(
	id int primary key,
    name varchar,
    email varchar,
    age int
);
insert into student values(1,"admin","admin@qq.com",22);
insert into student values(2,"reimu","reimu@qq.com",23);
insert into student values(3,"yoyoko","yoyoko@qq.com",24);
```



## 二、初始配置

⭕首先在idea中创建一个空的工程，在工程中创建一个maven的module，模板选择quickstart

* 添加依赖

  在pom.xml文件中，添加一下依赖

```xml
<!--  添加mybatis依赖  -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.4</version>
</dependency>
<!-- https://mvnrepository.com/artifact/mysql/mysql-connector-java -->
<!--mysql依赖-->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.38</version>
</dependency>
```

* 设置插件

  通常情况下，不在resources下的非java文件，如.xml  .properties等文件在maven编译后不会被拷贝到target目录，所以要添加以下插件，告诉maven把其他包下的.xml .propertis等文件拷贝到target中

  

  在pom.xml中，build标签中添加以下插件设置

```xml
<resources>
    <resource>
        <directory>src/main/java</directory><!--所在的目录-->
        <includes><!--包括目录下的.properties,.xml 文件都会扫描到-->
            <include>**/*.properties</include>
            <include>**/*.xml</include>
        </includes>
        <filtering>false</filtering>
    </resource>
</resources>
```



## 三、具体代码

* 在pojo包中，创建实体类

```java
public class Student{
    private Integer id;
    private String name;
    privaet String email;
    private Integer age;
    
    setter and getter...
    toString...
}
```

* 在dao包中创建StudentDAO接口

```java
public interface StudentDAO{
    //查询所有学生的方法
    List<Student> queryStudents();
    //查询单个学生的方法
    Student queryStudentById(Integer id);
}
```

* 在dao包中创建StudentDAO.xml文件，这个文件是用来写sql语句的
* （注意文件名和上面的接口名最好一样）

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--
mapper:sql映射文件的根标签
namespace:必须有值，自定义的唯一字符串 
 推荐使用：dao 接口的全限定名称
-->
<mapper namespace="com.lijad.dao.StudentDAO">
    <!-- 
    id:该句sql语句的id标识，建议使用接口中方法名称
    resultType:执行sql语句后返回的类型，不一定是对应的Student类型，建议使用全限定名称命名     
     -->
    <select id="queryStudents" resultType="com.lijad.pojo.Student">
        <!--具体的sql语句-->              
        select id,name,email,age from student
    </select>
</mapper>
```



* 项目 src/main 下创建 resources 目录，设置 resources 目录为 resources root
* 创建mybatis主配置文件，文件名自定义，这里例子定义为mybatis.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
 PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
 "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
 <!--配置 mybatis 环境-->
 <environments default="development">
 <!--id:数据源的名称-->
 <environment id="development">
 <!--配置事务类型：使用 JDBC 事务（使用 Connection 的提交和回滚）-->
 <transactionManager type="JDBC"/>
 <!--数据源 dataSource：创建数据库 Connection 对象
 type: POOLED 使用数据库的连接池 
 -->
 <dataSource type="POOLED">
 <!--连接数据库的四个要素-->
 <property name="driver" value="com.mysql.jdbc.Driver"/>
 <property name="url" value="jdbc:mysql://localhost:3306/ssm"/>
 <property name="username" value="root"/>
 <property name="password" value="2333"/>
 </dataSource>
 </environment>
 </environments>
 <mappers>
 <!--告诉 mybatis 要执行的 sql 语句的位置-->
 <mapper resource="com/lijad/dao/StudentDAO.xml"/>
 </mappers>
</configuration>
```



## 四、编写测试

* 在test包下，创建MyTest

```java
@Test
public void testStart() throws IOException {
     //1.mybatis 主配置文件 
     String config = "mybatis.xml";
     //2.读取配置文件 
     InputStream in = Resources.getResourceAsStream(config);
     //3.创建 SqlSessionFactory 对象,目的是获取 SqlSession 
     SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(in);
     //4.获取 SqlSession,SqlSession 能执行 sql 语句
     SqlSession session = factory.openSession();
     //5.执行 SqlSession 的 selectList()
     //命名空间 + . + sql语句id
     String sqlId = "com.lijad.dao.StudentDAO.queryStudents";
     List<Student> studentList = session.selectList(sqlId);
     //6.循环输出查询结果 
     studentList.forEach( student -> System.out.println(student));
     //7.关闭 SqlSession，释放资源
     session.close();
}
```



## 五、封装工具类

可以看出，上面的实现方式比较繁琐。大量代码是为了拿到SqlSession对象，所以可以封装到工具类，用来获取SqlSession

```java
public class DBUtils {
    private static SqlSessionFactory factory = null;
    static {
        try {
            String config = "mybatis.xml";
            InputStream in = Resources.getResourceAsStream(config);
            factory = new SqlSessionFactoryBuilder().build(in);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    public static SqlSession getSqlSession() {
        SqlSession session = null;
        if (factory != null){
            session = factory.openSession();
        }
        return session;
    }
}

```





总结

* 创建数据库表、创建空工程、Maven模块
* pom.xml添加依赖（mybatis和mysql）、添加插件
* 创建pojo包、实体类
* 创建dao包，对应dao接口，接口编写方法
* dao包创建xml文件sql映射，编写sql语句
* resources下创建主配置文件mybatis.xml
* 编写实测类



## EX、常见问题

* 添加了插件之后，编译代码后，在target下没有mybatis主配置文件?

解决方案：

出现这个问题，通常不是代码的问题，而是idea的问题

* clean，再重新编译，再直接运行代码。大概率解决问题，可能是因为idea没有刷新，跑一遍程序就刷新了
* 在菜单栏上找到build，build——>Rebuild Project



⭕以上就是本期内容，你学废了吗？遇到其他问题，欢迎在评论区留言哦。

​										--END--

![image-20211226160910708](F:\course\JavaProjects\JavaSE\课堂笔记\pic\image-20211226160910708.png)