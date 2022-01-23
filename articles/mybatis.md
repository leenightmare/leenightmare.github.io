# 					MyBatis快速使用步骤

注意：使用mybatis之前，先确认maven已经配置好



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





# 使用传统 Dao 与动态代理

使用 Dao 的实现类,操作数据库

```java
public class StudentDaoImpl implements StudentDao{
    public List<Student> queryStudents() {
        SqlSession session = MyBatisUtil.getSqlSession();
        List<Student> studentList = session.selectList(
            "com.bjpowernode.dao.StudentDao.selectStudents");
        session.close();
        return studentList;
    }
    
    //.....其他增删改查方法....
}
    
```



在前面例子中自定义 Dao 接口实现类时发现一个问题：Dao 的实现类其实并没有干什么实质性的工

作，它仅仅就是通过 SqlSession 的相关 API 定位到映射文件 mapper 中相应 id 的 SQL 语句，真正对 DB 进

行操作的工作其实是由框架通过 mapper 中的 SQL 完成的。



所以，MyBatis 框架就抛开了 Dao 的实现类，直接定位到映射文件 mapper 中的相应 SQL 语句，对

DB 进行操作。这种对 Dao 的实现方式称为 Mapper 的动态代理方式。

Mapper 动态代理方式无需程序员实现 Dao 接口。接口是由 MyBatis 结合映射文件自动生成的动态代

理实现的。





⭕简单来说，就是不用自己写接口的实现类了，通过调用sqlSession.getMapper(DAO.class)方法，传入接口的class属性，mybatis就会再内部创建代理对象，实现接口中的方法。如下：

```java
@Test
public void test(){
    SqlSession session = DBUtils.getSqlSession();
    //mapper就是代理对象，此外，该语句最好写在方法外，作为全局变量使用
    StudentDAO mapper = session.getMapper(StudentDAO.class);
    List<Student> students = mapper.selectStudents();
    session.close();
}
```

⭕动态代理的方式实现dao有以下要求

* sql映射文件(如StudentDAO.xml)中的namspace必须是接口的全限定名称
* 每句sql语句的id名必须是接口中的方法名称





# 深入理解参数



## parameterType

parameterType：声明java语句中传来的参数类型，即接口中方法参数的类型。类型的完全限定名或别名。可以省略，因为 MyBatis 可以推断出具体传入语句的参数，默认值为未设置（unset）。

```
<select>,<insert>,<update>,<delete>都可以使用 parameterType 指定类型
```

```xml
<delete id="deleteStudent" parameterType="int">
    delete from student where id = #{id}
</delete>
<!-- 等同于 -->
<delete id="deleteStudent" parameterType="java.lang.Integer">
    delete from student where id = #{id}
</delete>


```



## 参数的传递

> 从 java 代码中把参数传递到 mapper.xml 文件，填充sql语句的占位符



* **只用一个简单参数的情况**

> 这里的简单类型指：java的8个基本类型和String类型

**语法**：`#{标识符}`或者`${标识符}`

```java
//接口中的方法
int deleteStudent(Integer id);
```

```xml
<!--对应的sql语句-->
<delete id="deleteStudent">
    delete from student where id = #{myid}
    <!--    delete from student where id = #{可以替换成任意合法标识符}  -->
</delete>
```



* **传入多个参数的情况**

1、在接口定义的方法中的参数中，使用@Param注解。官方推荐的方式。

**语法**：`#{@Param中定义的名称}`或者`${@Param中定义的名称}`

```java
//接口中的方法
List<Student> selectStudentByNameAndId(@Param(value="myId") Integer id, 
                                       @Param(value="myName") String name);
/**
*1、value可以省略
*2、名称自定义
```

```xml
<!--对应的sql语句-->
<select id="selectStudentByNameAndId" resultType="com.lijad.pojo.Student">
    select id,name,eamil,age from student where id = #{myId} and name = #{myName}
</select>
```



2、把参数封装到一个对象中，把对象作为参数

**完整语法**： #{ 对象的属性名,javaType=java 中数据类型名,jdbcType=数据类型名称 }

**常用格式**： #{ 对象的属性名 }

> 因为jdbcType 的类型 MyBatis 可以检测出来，一般不需要设置。

```java
//创建保存参数值的对象 QueryParam
/*
public class QueryParam {
 	private String queryName;
 	private int queryAge;
 	//set ，get 方法
}
*/
public class Student{......} //实体类
//因为对应的实体类正好可以满足情况，所以也可以不新建QueryParam，而直接使用实体类作为参数
List<Student> selectStudentByNameAndId(Student student); //接口方法
```

```xml
<!--对应的sql语句-->
<select id="selectStudentByNameAndId" resultType="com.lijad.pojo.Student">
    <!--这种传对象的方式，要注意这里的#{}里面就要求是对象的属性名称-->
    select id,name,eamil,age from student where id = #{id} and name = #{name}
</select>
```



3、把参数封装到Map集合中

**语法**：# { key }

```java
//接口方法
List<Student> selectStudentByNameAndId(Map<String,Object> map);
```

```xml
<!--对应的sql语句-->
<select id="selectStudentByNameAndId" resultType="com.lijad.pojo.Student">
    select id,name,eamil,age from student where id = #{myId} and name = #{myName}
</select>
```

```java
//测试代码
Map<String,Objcet> map = new HashMap<>();
map.put("myId",1);
map.put("myName","admin");
```



4、按照参数的位置

**语法**：# { arg 位置 }，第一个参数是#{arg0}, 第二个是#{arg1}

> 注意：mybatis-3.3 版本和之前的版本使用#{0},#{1}方式， 从 mybatis3.4 开始使用#{arg0}方式。

```java
List<Student> selectStudentByNameAndId(Integer id , String name);
```

```xml
<!--对应的sql语句-->
<select id="selectStudentByNameAndId" resultType="com.lijad.pojo.Student">
    select id,name,eamil,age from student where id = #{arg0} and name = #{arg1}
</select>
```



## #{}和${}的区别

⭕#是填充占位符，即JDBC中的`PrepareStatement`。$是字符串拼接即，JDBC中的`Statement`



## 封装MyBatis输出结果

**resultType**：执行 sql 得到 ResultSet 转换的类型，使用类型的完全限定名或别名。 注意如果返回的是集

合，那应该设置为集合包含的类型，而不是集合本身。resultType 和 resultMap，不能同时使用。



1、简单类型：如 resultType = "int"

2、对象类型：如resultType = "com.lijad.pojo.Student"

**3、多个对象类型(对象集合)**：如

```java
//接口方法
List<Student> selectStudents();
```

这种情况返回的应该是Student类型，而不是List类型。如：resultType = "com.lijad.pojo.Student"



4、Map

sql 的查询结果作为 Map 的 key 和 value。推荐使用 Map<Object,Object>。

注意：Map 作为接口返回值，sql 语句的查询结果最多只能有一条记录。大于一条记录是错误，可以用List再套Map解决，如：List<Map<Object,Objcet>>

```java
//接口方法
Map<Object,Object> selectReturnMap(int id);
```

```xml
mapper 文件：
<select id="selectReturnMap" resultType="java.util.HashMap">
 select name,email from student where id = #{studentId}
</select>
```

```java
//测试
Map<Object,Object> retMap = studentDao.selectReturnMap(1);
System.out.println("查询结果是 Map:"+retMap);
```



**resultMap**：可以自定义 sql 的结果和 java 对象属性的映射关系。更灵活的把列值赋值给指定属性。常用在列名和 java 对象属性名不一样的情况。

使用方式：

1.先定义 resultMap,指定列名和属性的对应关系。

2.在<select>中把 resultType 替换为 resultMap。

```java
//接口方法
List<Student> selectUseResultMap(QueryParam param);
```

```xml
mapper 文件：
<!-- 创建 resultMap
 id:自定义的唯一名称，在<select>使用
 type:期望转为的 java 对象的全限定名称或别名 
-->
<resultMap id="studentMap" type="com.bjpowernode.domain.Student">
    <!-- 主键字段使用 id -->
    <id column="id" property="id" />
    <!--非主键字段使用 result-->
    <result column="name" property="name"/>
    <result column="email" property="email" />
    <result column="age" property="age" />
</resultMap>
<!--resultMap: resultMap 标签中的 id 属性值--> 
<select id="selectUseResultMap" resultMap="studentMap">
 select id,name,email,age from student where name=#{queryName} or 
age=#{queryAge}
</select>
```





## 实体类属性名和列名不同的处理方式

1、使用别名

```xml
<select id="selectUseFieldAlias" 
resultType="com.bjpowernode.domain.PrimaryStudent">
 select id as stuId, name as stuName,age as stuAge
 from student where name=#{queryName} or age=#{queryAge}
</select>
```



2、使用resultMap

```xml
<resultMap id="primaryStudentMap" 
type="com.bjpowernode.domain.PrimaryStudent">
 <!-- 主键字段使用 id -->
 <id column="id" property="stuId" />
 <!--非主键字段使用 result-->
 <result column="name" property="stuName"/>
 <result column="age" property="stuAge" />
</resultMap>
```



## 模糊查询

**1: java** 代码中提供要查询的字符

```java
String = "%a%";
```

**2**：mapper 文件中使用 like name "%" #{xxx} "%"

```xml
select id,name,email,age from student where name like "%" #{studentName} "%"
```





# 动态SQL

* <if>
* <where>
* <choose/>
* <foreach>



⭕注意：

在 mapper 的动态 SQL 中若出现大于号（ > ）、小于号（<）、大于等于号（>=），小于等于号（<=）等符号，最好将其转换为实体符号。否则，XML 可能会出现解析出错问题。特别是对于小于号（<），在 XML 中是绝不能出现的。否则解析 mapper 文件会出错。



## 动态 SQL 之`<if>`

对于该标签的执行，当 test 的值为 true 时，会将其包含的 SQL 片断拼接到其所在的 SQL 语句中。

语法：<if test="条件"> sql 语句的部分 </if>

> 为了避免if条件不满足时出现的可能sql语句错误，可以在where后面添加1 = 1

```xml
mapper 文件：
<select id="selectStudentIf" resultType="com.lijad.pojo.Student">
    select id,name,email,age from student
    where 1=1
    <if test="name != null and name !='' ">
        and name = #{name}
    </if>
    <if test="age > 0 ">
        and age &gt; #{age}
    </if>
</select>
```



## 动态 SQL 之`<where>`

>  满足条件则在sql后面添加where字句，否则不添加。where语句可以解决上面if条件不满足造成的麻烦

语法：<where> 其他动态 sql </where>

```xml
mapper 文件：
<select id="selectStudentWhere" resultType="com.bjpowernode.domain.Student">
    select id,name,email,age from student
    <where>
        <if test="name != null and name !='' ">
            and name = #{name}
        </if>
        <if test="age > 0 ">
            and age &gt; #{age}
        </if>
    </where>
</select>
```





## 动态SQL之`<foreach>`

语法：

➢ collection 表示要遍历的集合类型, list ，array 等。

➢ open、close、separator 为对遍历内容的 SQL 拼接。

```xml
<foreach collection="集合类型" open="开始的字符" close="结束的字符" 
    item="集合中的成员" separator="集合成员之间的分隔符">
    #{item 的值}
</foreach>
```

```xml
mapper 文件：
<select id="selectStudentForList" 
        resultType="com.bjpowernode.domain.Student">
    select id,name,email,age from student
    <if test="list !=null and list.size > 0 ">
        where id in
        <foreach collection="list" open="(" close=")" 
                 item="stuid" separator=",">
            #{stuid}
        </foreach>
    </if>
</select>
```



## 动态 SQL 之代码片段

语法：<sql id="">sql语句</sql>

```xml
mapper 文件：
<!--创建 sql 片段 id:片段的自定义名称-->
<sql id="studentSql">
    select id,name,email,age from student
</sql> 
<select id="selectStudentSqlFragment" resultType="com.bjpowernode.domain.Student">
    <!-- 引用 sql 片段 -->
    <include refid="studentSql"/>
    <if test="list !=null and list.size > 0 ">
        where id in
        <foreach collection="list" open="(" close=")" 
                 item="stuobject" separator=",">
            #{stuobject.id}
        </foreach>
    </if>
</select>
```





# 部分配置设置

> mybatis-config.xml 文件元素节点是有一定顺序的，节点位置必须按以上位置排序，否则会编译错误。
>
> mybatis主配置文件结构如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration><!-- 配置 -->
    <properties /><!-- 属性 -->
    <settings /><!-- 设置 -->
    <typeAliases /><!-- 类型命名 -->
    <typeHandlers /><!-- 类型处理器 -->
    <objectFactory /><!-- 对象工厂 -->
    <plugins /><!-- 插件 -->
    <environments><!-- 配置环境 -->
        <environment><!-- 环境变量 -->
            <transactionManager /><!-- 事务管理器 -->
            <dataSource /><!-- 数据源 -->
        </environment>
    </environments>
    <databaseIdProvider /><!-- 数据库厂商标识 -->
    <mappers /><!-- 映射器 -->
</configuration>
```





## 开启自动提交事务

```java
//在获取sqlSession时，传入true
factory.openSession(true);
```



## 使用propertis配置文件配置数据库连接信息

1、创建properties文件，建议key部分使用两级或三级命名

```properties
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/ssm
jdbc.user=root
jdbc.password=2333
```

2、在mybatis文件中引用

```xml
<properties resource="jdbc.properties" />
<dataSource type="POOLED">
    <!--使用 properties 文件: 语法 ${key}-->
 <property name="driver" value="${jdbc.driver}"/>
 <property name="url" value="${jdbc.url}"/>
 <property name="username" value="${jdbc.username}"/>
 <property name="password" value="${jdbc.password}"/>
</dataSource>

```



## typeAliases（类型别名）

```xml
<typeAliases>
 <!--
 定义单个类型的别名
 type:类型的全限定名称
 alias:自定义别名 
 -->
 <typeAlias type="com.bjpowernode.domain.Student" alias="mystudent"/>
 <!--
 批量定义别名，扫描整个包下的类，别名为类名（首字母大写或小写都可以）
 name:包名 
 -->
 <package name="com.bjpowernode.domain"/>
 <package name="...其他包"/>
</typeAliases>

```



## mappers（映射器）

（1） <mapper resource=" " />

​			使用相对于类路径的资源,从 classpath 路径查找文件

​			例如：<mapper resource="com/bjpowernode/dao/StudentDao.xml" /> 

（2） <package name=""/>

指定包下的所有 Dao 接口

​			如：<package name="com.bjpowernode.dao"/> 

​			注意：此种方法要求 Dao 接口名称和 mapper 映射文件名称相同，且在同一个目录



# MyBatis注解（3种类型）

如果使用注解开发，还是要在mybatis主配置文件中添加配置

```xml
<!--指定带有注解的dao接口所在位置-->
<mappers>
    <package name="com.keafmd.dao"></package>
</mappers>
```



## 1. SQL 语句映射

#### 1）@Insert：实现新增功能

```java
@Insert("insert into user(id,name) values(#{id},#{name})")
public int insert(User user);
```

#### 2）@Select：实现查询功能

```java
@Select("Select * from user")
@Results({
    @Result(id = true, column = "id", property = "id"),
    @Result(column = "name", property = "name"),
    @Result(column = "sex", property = "sex"),
    @Result(column = "age", property = "age")
})
List<User> queryAllUser();
```

#### 3）@SelectKey：插入后，获取id的值

以 MySQL 为例，MySQL 在插入一条数据后，使用 select last_insert_id() 可以获取到自增 id 的值。

```java
@Insert("insert into user(id,name) values(#{id},#{name})")
@SelectKey(statement = "select last_insert_id()", keyProperty = "id", keyColumn = "id", resultType = int,before = false)
public int insert(User user);
```

@SelectKey 各个属性含义如下。

- statement：表示要运行的 SQL 语句；
- keyProperty：可选项，表示将查询结果赋值给代码中的哪个对象；
- keyColumn：可选项，表示将查询结果赋值给数据表中的哪一列；
- resultType：指定 SQL 语句的返回值；
- before：默认值为 true，在执行插入语句之前，执行 select last_insert_id()。值为 flase，则在执行插入语句之后，执行 select last_insert_id()。

#### 4）@Insert：实现插入功能

```java
@Insert("insert into user(name,sex,age) values(#{name},#{sex},#{age}")
int saveUser(User user);
```

#### 5）@Update：实现更新功能

```java
@Update("update user set name= #{name},sex = #{sex},age =#{age} where id = #{id}")
void updateUserById(User user);
```

#### 6）@Delete：实现删除功能

```java
@Delete("delete from  user  where id =#{id}")
void deleteById(Integer id);
```

#### 7）@Param：映射多个参数

@Param 用于在 Mapper 接口中映射多个参数。@Param 中的 value 属性可省略，用于指定参数的别名。

```java
int saveUser(@Param(value="user") User user,@Param("name") String name,@Param("age") Int age);
```



## 2. 结果集映射

@Result、@Results、@ResultMap 是结果集映射的三大注解。

声明结果集映射关系代码：

```java
@Select({"select id, name, class_id from student"})
@Results(id="studentMap", value={
    @Result(column="id", property="id", jdbcType=JdbcType.INTEGER, id=true),
    @Result(column="name", property="name", jdbcType=JdbcType.VARCHAR),
    @Result(column="class_id ", property="classId", jdbcType=JdbcType.INTEGER)
})
List<Student> selectAll();
```

下面为 @Results 各个属性的含义。

- id：表示当前结果集声明的唯一标识；
- value：表示结果集映射关系；
- @Result：代表一个字段的映射关系。其中，column 指定数据库字段的名称，property 指定实体类属性的名称，jdbcType 数据库字段类型，id 为 true 表示主键，默认 false。



可使用 @ResultMap 来引用映射结果集，其中 value 可省略。

```java
@Select({"select id, name, class_id from student where id = #{id}"})
@ResultMap(value="studentMap")
Student selectById(Integer id);
```

这样不需要每次声明结果集映射时都复制冗余代码，简化开发，提高了代码的复用性。



## 3. 关系映射

#### 1）@one：用于一对一关系映射

```java
@Select("select * from student") 
@Results({ 
    @Result(id=true,property="id",column="id"), 
    @Result(property="name",column="name"), 
    @Result(property="age",column="age"), 
    @Result(property="address",column="address_id",one=@One(select="net.biancheng.mapper.AddressMapper.getAddress")) 
}) 
public List<Student> getAllStudents();  
```

#### 2）@many：用于一对多关系映射

```java
@Select("select * from t_class where id=#{id}") 
@Results({ 
    @Result(id=true,column="id",property="id"), 
    @Result(column="class_name",property="className"), 
    @Result(property="students", column="id", many=@Many(select="net.biancheng.mapper.StudentMapper.getStudentsByClassId")) 
    }) 
public Class getClass(int id); 
```

