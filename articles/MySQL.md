# 零、启动与关闭MySQL服务

net stop 服务名称

net start 服务名称

```
net stop MySQL
net start MySQL
```

退出mysql：exit、quit

```
效果如下：
1、使用exit
mysql> exit
Bye

2、使用quit
mysql> quit
Bye
```





# 一、常见命令

1.1登录MySQL

* 显示密码的方式

```
mysql -uroot -p2333
```

```
//出现以下语句表示登录成功
C:\Users\李坚达>mysql -uroot -p2333
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 3
Server version: 5.5.36 MySQL Community Server (GPL)

Copyright (c) 2000, 2014, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

* 隐藏密码的方式

```
mysql -uroot -p
```

```
C:\Users\李坚达>mysql -uroot -p
Enter password: ****
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 5
Server version: 5.5.36 MySQL Community Server (GPL)

Copyright (c) 2000, 2014, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```



1、查看mysql中有哪些数据库

> show databases;

```
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| test               |
+--------------------+
4 rows in set (0.00 sec)
```

mysql中默认自带了4个数据库



2、使用某个数据库

> use 数据库名

```
mysql> use test;
Database changed
```



3、创建数据库

> create database 名字;

```
mysql> create database test1;
Query OK, 1 row affected (0.00 sec)
```

