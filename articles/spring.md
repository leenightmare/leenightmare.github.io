# spring之xml配置

⭕前言：先配置好maven

## 快速配置spring

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





# spring之注解DI注入

对于 DI 使用注解，将不再需要在 Spring 配置文件中声明 bean 实例。

Spring 中使用注解

需要在原有 Spring 运行环境基础上再做一些改变。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans 				   http://www.springframework.org/schema/beans/spring-beans.xsd 				   http://www.springframework.org/schema/context 						              https://www.springframework.org/schema/context/springcontext.xsd">
    
    <!--使用注解开发，不用写bean，相对的
	需要在 Spring 配置文件中配置组件扫描器，用于在指定的基本包中扫描注解。
	可以一次指定多个包，使用(,)或("")隔开
	-->
    <context:component-scan base-package="com.lijad.pojo, com.lijad.dao; com.lijad.service"/>
</beans>

```



## 定义 Bean 的注解

### @Component(掌握)

在类上使用注解@Component，该注解的 value 属性用于指定该 bean 的 id 值。

```java
//value=可以省略，注解value的值相当于xml配置中的id。不指定value值时，默认是类名的首字母小写
@Component(value = "student")
public class Student{
    private String name;
    private Integer age;
}
```

另外，Spring 还提供了 3 个创建对象的注解：

➢ **@Repository** 用于对 DAO 实现类进行注解

➢ **@Service** 用于对 Service 实现类进行注解

➢ **@Controller** 用于对 Controller 实现类进行注解

> 这四个注解的作用都是告诉spring把对象放在容器中（类似配置bean）



### @Value（掌握）

可以用于类属性或set方法上赋值操作。使用该注解赋值时，类中可以没有set方法(下同)

```java
@Value(value = "张三")  //value=可以省略,不指定value值时，默认是null
private String name;
```



### byType 自动注入@Autowired(掌握)

在引用属性上使用注解@Autowired，默认使用按`类型`自动装配 Bean 的方式。

```java
@Autowired
private School school;

```



### byName 自动注入@Autowired 与@Qualifier(掌握)

这两个注解联合使用时，会由byType变成使用byName的方式自动注入。

@Qualifier 的 value 属性用于指定要匹配的 Bean 的 id 值

```java
@Component(value = "school")
public class School{}

@Autowired
@Qualifier(value = "school")
private School school;
```

```java
@Autowired 还有一个属性 required，默认值为 true，表示当匹配失败后，会抛出异常。若将其值设置为 false，则匹配失败，将被忽略，未匹配的属性值为 null。
@Autowired(required = false) //匹配失败时school会被赋null
@Qualifier(value = "school")
private School school;

```



### JDK 注解@Resource 自动注入(掌握)

@Resource 注解既可以按名称匹配Bean，可以按类型匹配 Bean。**默认是按名称注入**。使用该注解，要求 JDK 必须是 6 及以上版本



* byType 注入引用类型属性

@Resource 注解若不带任何参数，采用默认按名称的方式注入。按名称不能注入 bean， 

则会按照类型进行 Bean 的匹配注入。

```java
@Resource  //默认按默认名称（school）查找，没找到就按照类型查找
private School school;
```



* byName 注入引用类型属性

```java
//按指定名称查找，没找到就抛出异常。name=不可以省略
@Resource(name = "school")  
private School school;

```



**总结：**

* @Resource()不填参数，按名称匹配，没有就按类型匹配。

* @Resource(name = "xxxx") 按名称匹配，没有就抛异常。



# AOP 面向切面编程

AOP是一种思想。spring内部实现了AOP，但是用spring的方式比较繁琐。

AspectJ 是一个优秀面向切面的框架，它扩展了 Java 语言，提供了强大的切面实现。专注AOP

所以Spring 又将 AspectJ 的对于 AOP 的实现也引入到了自己的框架中。

在 Spring 中使用 AOP 开发时，一般使用 AspectJ 的实现方式



## AspectJ 的开发环境(掌握)

1、在maven中添加aspectj依赖

```xml
<dependency> 
    <groupId>org.springframework</groupId> 
    <artifactId>spring-aspects</artifactId> 
    <version>5.2.5.RELEASE</version>
</dependency>
```

2、引入AOP约束

在 AspectJ 实现 AOP 时，要引入 AOP 的约束。

配置文件中使用的 AOP 约束中的标签，

均是 AspectJ 框架使用的，而非 Spring 框架本身在实现 AOP 时使用的。

AspectJ 对于 AOP 的实现有注解和配置文件两种方式，常用是注解方式。

在spring配置文件中添加以下语句

```xml
<!--声明自动代理生成器，创建代理-->
<aop:aspectj-autoproxy />
```

其工作原理是，`<aop:aspectj-autoproxy/>`通过扫描找到@Aspect 定义的切面类，再由切

面类根据切入点找到目标类的目标方法，再由通知类型找到切入的时间点



3、定义业务接口和实现类

```java
public interface SomeService {
    void doSome();
}

@Service //放到spring容器中，也可使用xml方式
public class SomeServiceImpl implements SomeService {
    public void doSome() {
        System.out.println("doSome");
    }
}
```

4、定义切面类

```java
@Component  //把切面类放到容器中，也可以使用xml的方式实现
@Aspect   //是aspectj框架的注解，表示这是一个切面类
public class MyAspect {
    /*
    *前置通知，表示在目标方法执行之前执行
    *属性：value切入点表达式，表示切面执行的位置
    */
    @Before(value = "execution(* *..service.*.doSome(..))")
    public void printTime(){
        System.out.println("切面方法，在方法执行之前输出当前时间" + new Date());
    }
}
```

5、测试

```java
public void test2(){
    String resource = "applicationContext.xml";
    ApplicationContext context = new ClassPathXmlApplicationContext(resource);
    SomeService some = (SomeService) context.getBean("someServiceImpl");
    some.doSome();
/**************
切面方法，在方法执行之前输出当前时间Sat Oct 16 10:43:56 CST 2021
doSome
****************/
}

```



## 切入点表达式

AspectJ 定义了专门的表达式用于指定切入点。切入点表达式的作用就是通过表达式，匹配对应的目标方法，灵活多样。

表达式的原型是：

```java
execution(modifiers-pattern? ret-type-pattern 
		  declaring-type-pattern?name-pattern(param-pattern)
          throws-pattern?)
```

**解释：**

* modifiers-pattern] 访问权限类型

* ret-type-pattern 返回值类型

* declaring-type-pattern 包名类名

* name-pattern(param-pattern) 方法名(参数类型和参数个数)

* throws-pattern 抛出异常类型

* ？表示可选的部分

总结：**execution(访问权限 方法返回值 方法声明(参数) 异常类型)**

在表达式中可以使用以下符号：

| 意义 |                             符号                             |
| :--: | :----------------------------------------------------------: |
|  *   |                       0至多个任意字符                        |
|  ..  | 用在方法参数中，表示任意多个参数；用在包名后，表示当前包及其子路径 |
|  +   | 用在类名后，表示当前类以及其子类；用在接口后，表示当前接口以及其其实现类（少用 |



例子：

```java
execution(public * *(..)) 
指定切入点为：任意公共方法。
execution(* set*(..)) 
指定切入点为：任何一个以“set”开始的方法。
execution(* com.xyz.service.*.*(..)) 
指定切入点为：定义在 service 包里的任意类的任意方法。
execution(* com.xyz.service..*.*(..))
指定切入点为：定义在 service 包或者子包里的任意类的任意方法。“..”出现在类名中时，后
面必须跟“*”，表示包、子包下的所有类。
execution(* *..service.*.*(..))
指定所有包下的 serivce 子包下
```







##  JoinPoint 参数

所有的通知方法均可包含该参数。通过该参数，可获取切入点表达式、方法签名、目标对象等。该参数只能在第一个位置

```java
@Before(value = "execution(* *..service.*.doSome(..))")
    public void printTime(JoinPoint jp){
        System.out.println(jp.getSignature()); 
        //void com.lijad.service.SomeService.doSome()
    }
```



## @Before（掌握）

在方法执行之前执行



## @AfterReturning（掌握）

——后置通知-注解有 returning 属性

在目标方法执行之后执行，可以获得返回值。该注解的 returning 属性就是用于指定接收方法返回值的变量名的。所以，被注解为后置通知的方法，除了可以包含 JoinPoint 参数外，还可以包含用于接收返回值的变量。该变量最好为 Object 类型，因为目标方法的返回值可能是任何类型。

```java
    @AfterReturning(value = "execution(* *..service.*.doOther(..))",returning = "res")
    public void doOther(JoinPoint jp, Object res){
        System.out.println(res);
    }

```

> returning的值必须要和方法参数的名字相同



## @Around 环绕通知（掌握）

——环绕通知-增强方法有 ProceedingJoinPoint参数

在目标方法执行之前之后执行。被注解为环绕增强的方法要有返回值，Object 类型。并且方法可以包含一个 ProceedingJoinPoint 类型的参数。

接口 ProceedingJoinPoint 其有一个proceed()方法，用于执行目标方法。

```java
@Around(value = "execution(* *..service.*.doAround(..))")
//注意环绕通知的方法是有返回值的，不是void
//ProceedingJoinPoint是JoinPoint的子接口，同样可以调用其中的方法
public Object doAround(ProceedingJoinPoint pjp) throws Throwable {
    System.out.println("之前");
    Object res = pjp.proceed();  //目标方法执行，相当于动态代理的method的invoke
    System.out.println("之后");
    return res;
}

```



## @AfterThrowing异常通知（了解）

——注解中有 throwing 属性

在目标方法抛出异常后执行。该注解的 throwing 属性用于指定所发生的异常类对象。

当然，被注解为异常通知的方法可以包含一个参数 Throwable，参数名称为 throwing 指定的

名称，表示发生的异常对象。

```java
    @AfterThrowing(value = "execution(* *..service.*.doException(..))",throwing = "ex")
//throwing的值必须要和方法参数名称相同
    public void doAround(Exception ex){
        System.out.println("抛出异常" + ex.getMessage());
    }

```



## @After 最终通知（了解）

无论目标方法是否抛出异常，该增强均会被执行

@AfterThrowing和@After类似try...catch...finally



## @Pointcut 定义切入点

——提取切入点表达式

```java
@Pointcut(value = "execution(* *..service.*.do*(..))")
private void mypt(){}  //内部无需代码，因为只是用来定义，一般使用private修饰

//可以直接引入@Pointcut的方法作为作为切入点表达式
@Before(value = "mypt()")
public void printTime(JoinPoint jp){
    System.out.println("切面方法，在方法执行之前输出当前时间" + new Date());
}
```





# spring集成mybatis

spring中集成mybatis中，mybatis的配置文件不用写数据库连接信息，而是在spring配置文件中配置。而且，其中DataSource不再使用mybatis自带的，而是使用druid（同样是在spring中配置）

需要添加的依赖

```xml
<!--spring核心依赖 -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>5.2.5.RELEASE</version>
</dependency>
<!--spring事务依赖-->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-tx</artifactId>
    <version>5.2.5.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>5.2.5.RELEASE</version>
</dependency>
<!--   mybatis依赖     -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.1</version>
</dependency>
<!--  集成mybatis和spring的依赖      -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis-spring</artifactId>
    <version>1.3.1</version>
</dependency>
<!--   mysql驱动依赖     -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.9</version>
</dependency>
<!--   数据库连接池     -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.12</version>
</dependency>
```

```xml
插件，放在build标签下
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



创建mybatis所需的接口和配置文件

* pojo——Student
* dao ——> StudentDAO、StudentDAO.xml
* resources——>mybatis.xml

mybatis.xml主配置文件与之前有些不同

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!--  开启日志  -->
    <settings>
        <setting name="logImpl" value="STDOUT_LOGGING"/>
    </settings>
    环境信息不用在mybatis中配置了，将在spring中配置，好放到spring容器中
    <mappers>
        <!--指定映射文件位置-->
        <package name="com.lijad.dao"/>
    </mappers>
</configuration>
```



创建spring所需的接口和配置文件

* service ——>StudentService
* service.impl——>StudentServiceImpl
* resources——>applicationContext.xml

spring主配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">
   
    <!--在外部引用properties文件配置数据库连接信息-->
    <context:property-placeholder location="classpath:jdbc.properties" />
    
    <!--  配置datasource  -->
    <bean id="myDataSource" class="com.alibaba.druid.pool.DruidDataSource" init-method="init" destroy-method="close">
        <!--driver也不用自己配置了，程序内部可以推断出来-->
        <property name="url" value="${jdbc.url}"></property>
        <property name="username" value="${jdbc.username}"></property>
        <property name="password" value="${jdbc.password}"></property>
        <property name="maxActive" value="${jdbc.maxActive}"></property>
    </bean>

    <!--  配置sqlSessionFactory
  	SqlSessionFactoryBean：会在内部创建SqlSessionFactory对象并返回
	-->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="myDataSource"></property>
        <property name="configLocation" value="classpath:mybatis.xml"></property>
    </bean>

    <!--  配置dao
  	注意这个bean不用写id，直接class
	-->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <!--  指定SqlSessionFactory对象的id,注意是value而不是ref     -->
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"/>
        <!-- 指定包名,包名是dao接口所在的包名
             MapperScannerConfigurer会扫描这个包中所有的接口,把每个接口都执行一次
             getMapper()方法,得到每个接口的dao对象.
             创建好的dao对象放入到spring的容器中
             每个dao的id名称默认是接口名首字母小写
               -->
        <property name="basePackage" value="com.lijad.dao"/>
    </bean>
    <!--配置dao-->
       <bean id="studentService" class="com.lijad.service.impl.StudentServiceImpl">
       <property name="dao" ref="studentDAO" />
    </bean>
</beans>
```

> dataSource 包含数据库连接信息 mybatis.xml包含其他信息所以
>
> dataSource + mybatis.xml  ———可以满足创建———> SqlSessionFactory 
>
> SqlSessionFactory  + 接口  ——可以满足调用getMapper()创建——> 接口对应的dao代理对象
>
> dao———可以满足serviceImpl的setDao——>serviceImpl

最后，只在代码中就可以从spring容器中直接获取dao对象。

```java
public void test5(){
    String config = "applicationContext.xml";
    ApplicationContext context = new ClassPathXmlApplicationContext(config);
    StudentService service  = (StudentService) context.getBean("studentService");
    List<Student> students = service.queryStudents();
    for (Student student : students) {
        System.out.println(student);
    }
}
```





# spring事务

## spring事务的两个接口

### （1） 事务管理器接口(重点)

**PlatformTransactionManager**接口对象。其主要用于完成事务的提交、回滚，及获取事务的状态信息。



A、常用的两个实现类

PlatformTransactionManager 接口有两个常用的实现类：

➢ DataSourceTransactionManager：使用 JDBC 或 MyBatis 进行数据库操作时使用。

➢ HibernateTransactionManager：使用 Hibernate 进行持久化数据时使用。



B、 Spring 的回滚方式(理解)

Spring 事务的默认回滚方式是：发生`运行时异常`和 `error` 时`回滚`，发生`受查(编译)异常`时

`提交`。不过，对于受查异常，程序员也可以手工设置其回滚方式。 





### （2） 事务定义接口

**TransactionDefinition** 中定义了事务描述相关的三类常量：事务隔离级别、事务传播行为、事务默认超时时限，及对它们的操作。

**A、定义了五个事务隔离级别常量(掌握)**

这些常量均是以 ISOLATION_开头。即形如 ISOLATION_XXX。 

➢ DEFAULT：采用 DB 默认的事务隔离级别。MySql 的默认为 REPEATABLE_READ； Oracle

默认为 READ_COMMITTED。 

➢ READ_UNCOMMITTED：读未提交。未解决任何并发问题。

➢ READ_COMMITTED：读已提交。解决脏读，存在不可重复读与幻读。

➢ REPEATABLE_READ：可重复读。解决脏读、不可重复读，存在幻读

➢ SERIALIZABLE：串行化。不存在并发问题。



**B、 定义了七个事务传播行为常量(掌握)**

事务传播行为指，处于不同事务中的方法在相互调用时，执行期间事务的维护情况。如，A 事务中的方法 doSome()调用 B 事务中的方法 doOther()，在调用执行期间事务的维护情况，就称为事务传播行为。事务传播行为是加在方法上的。



事务传播行为常量都是以 PROPAGATION_ 开头，形如 PROPAGATION_XXX。

* **PROPAGATION_REQUIRED**

* **PROPAGATION_REQUIRES_NEW**

* **PROPAGATION_SUPPORTS**

* PROPAGATION_MANDATORY 

* PROPAGATION_NESTED

* PROPAGATION_NEVER

* PROPAGATION_NOT_SUPPORTED



**PROPAGATION_REQUIRED：**指定的方法必须在事务内执行。若当前存在事务，就加入到当前事务中；若当前没有事务，则创建一个新事务。spring默认事务传播行为

**PROPAGATION_SUPPORTS**：指定的方法支持当前事务，但若当前没有事务，也可以以非事务方式执行。

**PROPAGATION_REQUIRES_NEW**：总是新建一个事务，若当前存在事务，就将当前事务挂起，直到新事务执行完毕。



C、 定义了默认事务超时时限

常量 TIMEOUT_DEFAULT 定义了事务底层默认的超时时限，sql 语句的执行时长。

注意，事务的超时时限起作用的条件比较多，且超时的时间计算点较复杂。所以，该

值一般就使用默认值即可。



## 基于注解使用 Spring 事务

1、添加依赖：基于上面sring集成mybatis例子。事务功能实现主要依赖这两。当然其他必要的依赖也不能少

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-tx</artifactId>
    <version>5.2.5.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>5.2.5.RELEASE</version>
</dependency>
```

2、添加注解：

### @Transactional

位置：写在需要事务的public方法上；若在类上，则表示该类上所有public方法均将在执行时加入事务。

>  @Transactional只对public 方法有效，对于非public方法，spring会忽略。

可选属性：

➢ **propagation**：用于设置事务传播属性。该属性类型为 Propagation 枚举，默认值为Propagation.REQUIRED。 

➢ **isolation**：用于设置事务的隔离级别。该属性类型为 Isolation 枚举，默认值为

Isolation.DEFAULT。 

➢ **readOnly**：用于设置该方法对数据库的操作是否是只读的。该属性为 boolean，默认值

为 false。 

➢ **timeout**：用于设置本操作与数据库连接的超时时限。单位为秒，类型为 int，默认值为

-1，即没有时限。

➢ **rollbackFor**：指定需要回滚的异常类。类型为 Class[]，默认值为空数组。当然，若只有

一个异常类时，可以不使用数组。

➢ **rollbackForClassName**：指定需要回滚的异常类类名。类型为 String[]，默认值为空数组。

当然，若只有一个异常类时，可以不使用数组。

➢ **noRollbackFor**：指定不需要回滚的异常类。类型为 Class[]，默认值为空数组。当然，若

只有一个异常类时，可以不使用数组。

➢ **noRollbackForClassName**：指定不需要回滚的异常类类名。类型为 String[]，默认值为空

数组。当然，若只有一个异常类时，可以不使用数组

方法实现如下：

```java
@Transactional(propagation = Propagation.REQUIRED,
            readOnly = false,
            isolation = Isolation.DEFAULT,
            rollbackFor = {AmountNotEnoughException.class, NullPointerException.class}
    )
    public int buyGoods(Integer id, Integer count) {
        //具体业务...
        //遇到异常等情况，spring会回滚。方法执行完spring会提交。不需要程序员手动提交回滚了，spring会帮我们做
    }
/***********上面注解中的值都是使用默认值，开发中一般也是使用默认值。可简化如下**************/

@Transactional
public int buyGoods(Integer id, Integer count) {
         //具体业务...
}
```

3、配置spring主配置文件,基于spring集成mybatis例子，添加下面配置

​	3.1、声明事务管理器

```xml
 <!--  声明事务管理器、无论是注解方式还是aop方式。都要配置-->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="myDataSource"></property>
</bean>
```

​	3.2、开启注解驱动

```xml
<!--使用注解的方式需要配置。管理事务,适合中小型项目  开 -->
<!--声明事务注解驱动-->
<tx:annotation-driven transaction-manager="transactionManager"/>
```



小结：

* 添加依赖：tx、jdbc
* 添加注解：@Transactional
* 配置文件：DataSourceTransactionManager事务管理器、注解驱动



## 使用 AspectJ 的 AOP 配置管理事务

使用 XML 配置事务代理的方式的不足是，每个目标类都需要配置事务代理。

当目标类较多，配置文件会变得非常臃肿。

使用 XML 配置顾问方式可以自动为每个符合切入点表达式的类生成事务代理。

其用法很简单，只需将前面代码中关于事务代理的配置删除，再替换为如下内容即可。

1、添加依赖。基于上面的例子，再添加一个依赖

```xml
<!--新加入 aspectj 的依赖坐标-->
<dependency> 
    <groupId>org.springframework</groupId> 
    <artifactId>spring-aspects</artifactId> 
    <version>5.2.5.RELEASE</version>
</dependency>
```

2.1、配置spring主配置文件

事务管理器是必须的

```xml
 <!--  声明事务管理器、无论是注解方式还是aop方式。都要配置-->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="myDataSource"></property>
</bean>
```

2.2、配置事务通知

为事务通知设置相关属性。用于指定要将事务以什么方式织入给哪些方法。

例如，应用到 buy 方法上的事务要求是必须的，且当 buy 方法发生异常后要回滚业务。

```xml
<!--2.声明业务方法它的事务属性（隔离级别，传播行为，超时时间）
          id:自定义名称，表示 <tx:advice> 和 </tx:advice>之间的配置内容的
          transaction-manager:事务管理器对象的id
    -->
<tx:advice id="myAdvice" transaction-manager="transactionManager">
    <!--tx:attributes：配置事务属性-->
    <tx:attributes>
        <!--tx:method：给具体的方法配置事务属性，method可以有多个，分别给不同的方法设置事务属性
                name:方法名称，1）完整的方法名称，不带有包和类。
                              2）方法可以使用通配符,* 表示任意字符
                propagation：传播行为，枚举值
                isolation：隔离级别
                rollback-for：你指定的异常类名，全限定类名。 发生异常一定回滚
            -->
        <tx:method name="buy" propagation="REQUIRED" isolation="DEFAULT"
                   rollback-for="java.lang.NullPointerException,com.bjpowernode.excep.NotEnoughException"/>

        <!--使用通配符，指定很多的方法-->
        <tx:method name="add*" propagation="REQUIRES_NEW" />
        <!--指定修改方法-->
        <tx:method name="modify*" />
        <!--删除方法-->
        <tx:method name="remove*" />
        <!--查询方法，query，search，find-->
        <tx:method name="*" propagation="SUPPORTS" read-only="true" />
    </tx:attributes>
</tx:advice>
```

2.3、配置aop增强器

上面只配置了哪些方法需要用到事务，但还不知道是哪些类的方法。所以要指定将配置好的事务通知，植入给谁。

```xml
<!--配置aop-->
<aop:config>
    <!--配置切入点表达式：指定哪些包中类，要使用事务
            id:切入点表达式的名称，唯一值
            expression：切入点表达式，指定哪些类要使用事务，aspectj会创建代理对象
            com.bjpowernode.service
            com.crm.service
            com.service
        -->
    <aop:pointcut id="servicePt" expression="execution(* *..service..*.*(..))"/>

    <!--配置增强器：关联adivce和pointcut
           advice-ref:通知，上面tx:advice哪里的配置
           pointcut-ref：切入点表达式的id
        -->
    <aop:advisor advice-ref="myAdvice" pointcut-ref="servicePt" />
</aop:config>
```



# spring与web

```java
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String id = req.getParameter("id");
    String username = req.getParameter("username");
    String email = req.getParameter("email");
    String age = req.getParameter("age");
    String config = "applicationContext.xml";

    ApplicationContext context = new ClassPathXmlApplicationContext(config);
    StudentService service = (StudentService) context.getBean("studentService");
    int nums = service.addStudent(new Student(Integer.parseInt(id),username,email,Integer.parseInt(age)));
    System.out.println("成功向数据库添加【"+nums+"】条数据");
    req.getRequestDispatcher("/register_success.jsp").forward(req,resp);
}
```

在servlet中获取spring容器，通过容器获取对象的service，完成业务。

但是可以看出，每次接受请求就会新建一个spring容器，这样显然不合理。

所以应该把设置一个监听器，在程序启动时创建spring容器，然后把spring容器放到ServletContext中。这样整个项目中只创建一次容器，而且可以随时获取该容器。

这个监听器可以自己创建，也可以用spirng的。下面演示使用spring监听器的使用

需要添加下面的依赖。

```xml
<!--创建spring监听器对象需要用到-->
<dependency> 
    <groupId>org.springframework</groupId> 
    <artifactId>spring-web</artifactId> 
    <version>5.2.5.RELEASE</version>
</dependency>
<!-- servlet依赖 -->
<dependency>
 <groupId>javax.servlet</groupId>
 <artifactId>javax.servlet-api</artifactId>
 <version>3.1.0</version>
 <scope>provided</scope>
</dependency>
<!-- jsp依赖 -->
<dependency> 
 <groupId>javax.servlet.jsp</groupId> 
 <artifactId>jsp-api</artifactId> 
 <version>2.2.1-b03</version> 
 <scope>provided</scope>
</dependency>
```



在web.xml中创建监听器

```xml
<listener>
        <!--  监听器，会创建spring容器并放到ServletContext域中
			相当于
  			servletContext.setAttribute(key,spring容器);
			而这个key是 WebApplicationContext类的一个常量值
			WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE
		-->
	<listener-class>
    	org.springframework.web.context.ContextLoaderListener
    </listener-class>
</listener>
```

除此之外，还需要配置一个context-parm告诉监听器spring主配置文件的位置。

因为spring监听器对象的创建需要用到spring主配置文件，而默认情况下会在WEB-INF下找这个文件，所以需要把spring主配置文件放在该目录下或者用自己的位置覆盖它的。所以需要下面的配置

```xml
<context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>classpath:applicationContext.xml</param-value>
</context-param>
```



这样就可以通过getServletContext().getAttribute(key);的方式获取springr容器

```java
String key = WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE;
WebApplicationContext context =(WebApplicationContext)getServletContext().getAttribute(key);
StudentService service = (StudentService) context.getBean("studentService");
```



**通过** **WebApplicationContextUtils** **获取**

为了快速获取spring容器，可以通过工具类获取

WebApplicationContextUtils.getRequiredWebApplicationContext(ServletContext sc)这个方法

```java
ApplicationContext context = WebApplicationContextUtils.getRequiredWebApplicationContext(getServletContext());
```

