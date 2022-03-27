# Redis



## 一、Redis的安装与启动

> 环境:centos7

redis官网:	https://redis.io

下载最新压缩包: redis-6.2.6.tar.gz



### [1]	安装步骤

1.1	用xftp把压缩包上传到linux中/opt目录下



1.2	准备工作:因为redis的相关操作需要c语言的编译环境,所以需要在linux安装gcc

​		  下载安装最新版的gcc编译器



1.2.1	检查是否已有gcc

```
gcc --version
//如果环境没有gcc,执行下一步
```



1.2.2	yum命令安装(需要联网)

```
yum install gcc
```



1.3	解压redis-6.2.6.tar.gz

```
tar -zxvf redis-6.2.6.tar.gz
```



1.4	解压完成后,进入解压的目录 redis-6.2.6

```
cd redis-6.2.6
```



1.5	redis-6.2.6目录下执行make命令(把redis文件编译成C文件)

```
make
```



1.6	如果没有准备好C语言编译环境，make会报错—Jemalloc/jemalloc.h：没有那个文件

> 解决方案

1.6.1	先执行gcc --version看gcc是否安装成功

```
gcc --version
```

1.6.2	如果成功,执行 make distclean(把编译文件清除)

1.6.3	再次执行make



1.7	真正开始安装redis,还是在redis-6.2.6目录下执行

```
make install
```



1.8	如果以上没有出现错误,表示安装成功	默认安装在/usr/local/bin



1.9	进入/usr/local/bin查看文件

```
cd /usr/local/bin
ll
有以下文件说明安装成功
/**********************************
-rwxr-xr-x. 1 root root 4829488 Mar 25 09:37 redis-benchmark
lrwxrwxrwx. 1 root root      12 Mar 25 09:37 redis-check-aof -> redis-server
lrwxrwxrwx. 1 root root      12 Mar 25 09:37 redis-check-rdb -> redis-server
-rwxr-xr-x. 1 root root 5003776 Mar 25 09:37 redis-cli
lrwxrwxrwx. 1 root root      12 Mar 25 09:37 redis-sentinel -> redis-server
-rwxr-xr-x. 1 root root 9518904 Mar 25 09:37 redis-server
**********************************/
```

ex:	相关文件说明

```
查看默认安装目录：
redis-benchmark:性能测试工具，可以在自己本子运行，看看自己本子性能如何
redis-check-aof：修复有问题的AOF文件，rdb和aof后面讲
redis-check-dump：修复有问题的dump.rdb文件
redis-sentinel：Redis集群使用
redis-server：Redis服务器启动命令
redis-cli：客户端，操作入口
```



### [2]	启动redis

2.1	前台启动(不推荐)

> 在/usr/local/bin下执行。前台启动，命令行窗口不能关闭，否则服务器停止

```
redis-server

/*******************************************
6387:C 26 Mar 2022 02:43:41.898 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
6387:C 26 Mar 2022 02:43:41.898 # Redis version=6.2.6, bits=64, commit=00000000, modified=0, pid=6387, just started
6387:C 26 Mar 2022 02:43:41.898 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server /path/to/redis.conf
6387:M 26 Mar 2022 02:43:41.899 * Increased maximum number of open files to 10032 (it was originally set to 1024).
6387:M 26 Mar 2022 02:43:41.899 * monotonic clock: POSIX clock_gettime
                _._                                                  
           _.-``__ ''-._                                             
      _.-``    `.  `_.  ''-._           Redis 6.2.6 (00000000/0) 64 bit
  .-`` .-```.  ```\/    _.,_ ''-._                                  
 (    '      ,       .-`  | `,    )     Running in standalone mode
 |`-._`-...-` __...-.``-._|'` _.-'|     Port: 6379
 |    `-._   `._    /     _.-'    |     PID: 6387
  `-._    `-._  `-./  _.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |           https://redis.io       
  `-._    `-._`-.__.-'_.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |                                  
  `-._    `-._`-.__.-'_.-'    _.-'                                   
      `-._    `-.__.-'    _.-'                                       
          `-._        _.-'                                           
              `-.__.-'                                               

6387:M 26 Mar 2022 02:43:41.900 # WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower value of 128.
6387:M 26 Mar 2022 02:43:41.900 # Server initialized
6387:M 26 Mar 2022 02:43:41.900 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
6387:M 26 Mar 2022 02:43:41.900 * Loading RDB produced by version 6.2.6
6387:M 26 Mar 2022 02:43:41.900 * RDB age 20 seconds
6387:M 26 Mar 2022 02:43:41.900 * RDB memory usage when created 0.83 Mb
6387:M 26 Mar 2022 02:43:41.900 # Done loading RDB, keys loaded: 5, keys expired: 0.
6387:M 26 Mar 2022 02:43:41.900 * DB loaded from disk: 0.000 seconds
6387:M 26 Mar 2022 02:43:41.900 * Ready to accept connections

```



2.2	后台启动

2.2.1	备份redis.conf	拷贝一份redis.conf到其他目录

```
cp  /opt/redis-6.2.6/redis.conf  /etc/redis.conf

2.2.5.2.后台启动设置daemonize no改成yes
```

2.2.2	后台启动设置daemonize no改成yes

> 修改备份的redis.conf(128行)文件将里面的daemonize no 改成 yes，让服务在后台启动

```
vi /etc/redis.conf
```

2.2.3	后台启动redis

```
redis-server /etc/redis.conf
```

2.2.4	查看进程

```
[root@vultr bin]# ps -ef |grep redis
root      6426     1  0 02:51 ?      00:00:00 redis-server 127.0.0.1:6379  //启动成功
root      6432  6224  0 02:51 pts/0  00:00:00 grep --color=auto redis
```



### [3]	客户端访问与退出

3.1	客户端访问	测试验证： ping

```
[root@vultr /]# redis-cli

127.0.0.1:6379> ping
PONG
127.0.0.1:6379> 
```



3.2	离开客户端 exit

```
127.0.0.1:6379> exit
[root@vultr /]#
```



3.3	关闭redis

3.3.1	单实例关闭：redis-cli shutdown

```
[root@vultr /]# redis-cli shutdown
[root@vultr /]# ps -ef |grep redis
root      6507  6224  0 03:02 pts/0    00:00:00 grep --color=auto redis
```

3.3.2	也可以进入终端后再关闭

```
[root@vultr /]# redis-cli
127.0.0.1:6379> shutdown
not connected> exit
[root@vultr /]# ps -ef |grep redis
root      6528  6224  0 03:04 pts/0    00:00:00 grep --color=auto redis
```



## 二、Redis常用数据类型

### [1]	Redis键(key)

* keys *	查看当前库所有key   (匹配：keys *1)

```
127.0.0.1:6379> keys *
```

* exists key	判断某个key是否存在

```
127.0.0.1:6379> exists k1
```

* type key 	查看你的key是什么类型

```
127.0.0.1:6379> type k1
```

* del key    删除指定的key数据

```
127.0.0.1:6379> del k1
```

* unlink key  根据value选择非阻塞删除

  仅将keys从keyspace元数据中删除，真正的删除会在后续异步操作。

* expire key 10  10秒钟：为给定的key设置过期时间
* ttl key 查看还有多少秒过期，-1表示永不过期，-2表示已过期
* select命令切换数据库f
* dbsize查看当前数据库的key的数量
* flushdb清空当前库
* flushall通杀全部库



### [2]	Redis字符串(String)

* set  <key><value>	添加键值对

* get  <key>	查询对应键值

* append  <key><value>	将给定的<value> 追加到原值的末尾

* strlen  <key>	获得值的长度

* setnx  <key><value>	只有在 key 不存在时   设置 key 的值

* incr  <key>	将 key 中储存的数字值增1	只能对数字值操作，如果为空，新增值为1

* decr  <key>	将 key 中储存的数字值减1	只能对数字值操作，如果为空，新增值为-1

* incrby / decrby  <key>  <步长>	将 key 中储存的数字值增减。自定义步长。

> 原子性，有一个失败则都失败

* mset  <key1><value1><key2><value2>  ..... 	同时设置一个或多个 key-value对  

* mget  <key1><key2><key3> .....	同时获取一个或多个 value  

* msetnx <key1><value1><key2><value2>  ..... 	同时设置一个或多个 key-value 对，当且仅当所有给定 key 都不存在。

* getrange  <key> <起始位置> <结束位置>	获得值的范围，类似java中的substring，前包，后包
* setrange  <key> <起始位置> <value>	用 <value>  覆写<key>所储存的字符串值，从<起始位置>开始(索引从0开始)。

* setex  <key> <过期时间> <value>	设置键值的同时，设置过期时间，单位秒。
* getset <key> <value>	以新换旧，设置了新值同时获得旧值。



### [3]	Redis列表(List)

lpush/rpush  <key><value1><value2><value3> .... 从左边/右边插入一个或多个值。
lpop/rpop  <key>从左边/右边吐出一个值。值在键在，值光键亡。

rpoplpush  <key1><key2>从<key1>列表右边吐出一个值，插到<key2>列表左边。

lrange <key><start><stop>
按照索引下标获得元素(从左到右)
lrange mylist 0 -1   0左边第一个，-1右边第一个，（0-1表示获取所有）
lindex <key><index>按照索引下标获得元素(从左到右)
llen <key>获得列表长度 

linsert <key>  before <value><newvalue>在<value>的后面插入<newvalue>插入值
lrem <key><n><value>从左边删除n个value(从左到右)
lset<key><index><value>将列表key下标为index的值替换成value



### [4] 	Redis集合(set)

sadd <key><value1><value2> ..... 

将一个或多个 member 元素加入到集合 key 中，已经存在的 member 元素将被忽略

smembers <key>取出该集合的所有值。

sismember <key><value>判断集合<key>是否为含有该<value>值，有1，没有0

scard<key>返回该集合的元素个数。

srem <key><value1><value2> .... 删除集合中的某个元素。

spop <key>	随机从该集合中吐出一个值。

srandmember <key><n>随机从该集合中取出n个值。不会从集合中删除 。

smove <source><destination>value把集合中一个值从一个集合移动到另一个集合

sinter <key1><key2>返回两个集合的交集元素。

sunion <key1><key2>返回两个集合的并集元素。

sdiff <key1><key2>返回两个集合的差集元素(key1中的，不包含key2中的)



### [5] 	Redis哈希(Hash)

hset <key><field><value>给<key>集合中的  <field>键赋值<value>
hget <key1><field>从<key1>集合<field>取出 value 
hmset <key1><field1><value1><field2><value2>... 批量设置hash的值
hexists<key1><field>查看哈希表 key 中，给定域 field 是否存在。 
hkeys <key>列出该hash集合的所有field
hvals <key>列出该hash集合的所有value
hincrby <key><field><increment>为哈希表 key 中的域 field 的值加上增量 1   -1
hsetnx <key><field><value>将哈希表 key 中的域 field 的值设置为 value ，当且仅当域 field 不存在



### [6]	Redis有序集合Zset(sorted set) 

zadd  <key><score1><value1><score2><value2>…
将一个或多个 member 元素及其 score 值加入到有序集 key 当中。
zrange <key><start><stop>  [WITHSCORES]   
返回有序集 key 中，下标在<start><stop>之间的元素
带WITHSCORES，可以让分数一起和值返回到结果集。
zrangebyscore key minmax [withscores] [limit offset count]
返回有序集 key 中，所有 score 值介于 min 和 max 之间(包括等于 min 或 max )的成员。有序集成员按 score 值递增(从小到大)次序排列。 
zrevrangebyscore key maxmin [withscores] [limit offset count]               
同上，改为从大到小排列。 
zincrby <key><increment><value>      为元素的score加上增量
zrem  <key><value>删除该集合下，指定值的元素 
zcount <key><min><max>统计该集合，分数区间内的元素个数 
zrank <key><value>返回该值在集合中的排名，从0开始。



### [7]	Bitmaps

7.1	简介

现代计算机用二进制（位） 作为信息的基础单位， 1个字节等于8位， 例如“abc”字符串是由3个字节组成， 但实际在计算机存储时将其用二进制表示， “abc”分别对应的ASCII码分别是97、 98、 99， 对应的二进制分别是01100001、 01100010和01100011，如下图

````
			 a			
---------------------------------
▐ 0 ▐ 1 ▐ 1 ▐ 0 ▐ 0 ▐ 0 ▐ 0 ▐ 1 ▐ 
---------------------------------
````



Redis提供了Bitmaps这个“数据类型”可以实现对位的操作：

（1） Bitmaps本身不是一种数据类型， 实际上它就是字符串（key-value） ， 但是它可以对字符串的位进行操作。

（2） Bitmaps单独提供了一套命令， 所以在Redis中使用Bitmaps和使用字符串的方法不太相同。 可以把Bitmaps想象成一个以位为单位的数组， 数组的每个单元只能存储0和1， 数组的下标在Bitmaps中叫做偏移量。

```
[key] : [0 1 0 0 0 1 0 1 0 0 0 1 1 0 0]
```



7.2	setbit

（1）格式

>  setbit <key> <offset> <value>设置Bitmaps中某个偏移量的值（0或1）*offset:偏移量从0开始

```
setbit key 0 1	//在第一个(下标为0)的bit位中设置值为1
setbit key 2 1

// key:[1 0 1 0 0 0 0 0]
```

>  getbit <key> <offset>

```
getbit key 0  //获取第一个比特位的值
```

>  bitcount

统计字符串被设置为1的bit数。一般情况下，给定的整个字符串都会被进行计数，通过指定额外的 start 或 end 参数，可以让计数只在特定的位上进行。start 和 end 参数的设置，都可以使用负数值：比如 -1 表示最后一个位，而 -2 表示倒数第二个位，start、end 是指bit组的字节的下标数，二者皆包含。

bitcount <key> [start end] 统计字符串从start字节到end字节比特值为1的数量

!!!注意是这里的start end按字节(8bit)单位的

如:

k1:[01000010  00001000 11001000]

```
bicount k1 0 1
表示从01000010  00001000中计算1的数量


bicount k1 0 0
表示从01000010中计算1的数量
```



> bitop是一个复合操作， 它可以做多个Bitmaps的and（交集） 、 or（并集） 、 not（非） 、 xor（异或） 操作并将结果保存在destkey中。

bitop and(or/not/xor) <destkey> [key…]

```
bitop and newkey k1 k2
//从k1 k2中取交集并去重,结果保存到newkey中

```



### [8]	HyperLogLog

> 存储的元素不可重复,类似set

pfadd <key>< element> [element ...]  添加指定元素到 HyperLogLog 中

pfcount<key> [key ...] 计算个数基数

pfmerge<destkey> <sourcekey> [sourcekey ...] 合并后的结果存储在另一个key中



### [9]	Geospatial

> Redis 3.2 中增加了对GEO类型的支持。GEO，Geographic，地理信息的缩写。该类型，就是元素的2维坐标，在地图上就是经纬度。redis基于该类型，提供了经纬度设置，查询，范围查询，距离查询，经纬度Hash等常见操作。



geoadd<key>< longitude><latitude><member> [longitude latitude member...]  添加地理位置（经度，纬度，名称）

```
geoadd city 121.47 31.23 shanghai
geoadd city 106.50 29.53 chongqing 114.05 22.52 shenzhen 116.38 39.90 beijing
```

* 有效的经度从 -180 度到 180 度。有效的纬度从 -85.05112878 度到 85.05112878 度。

* 已经添加的数据，是无法再次往里面添加的。



geopos  <key><member> [member...]  获得指定地区的坐标值

```
127.0.0.1:6379> geopos city shanghai
1) 1) "121.47000163793563843"
   2) "31.22999903975783553"
```



geodist<key><member1><member2>  [m|km|ft|mi ]  获取两个位置之间的直线距离

```
127.0.0.1:6379> geodist city shanghai chongqing km
"1447.6737"
```



georadius<key>< longitude><latitude>radius m|km|ft|mi  以给定的经纬度为中心，找出某一半径内的元素

```
127.0.0.1:6379> georadius city 110 30 1000 km
1) "chongqing"
2) "shenzhen"
```





## 三、Jedis的使用

### [1]	准备事项

1.1	禁用Linux的防火墙(或者开启相应的端口)

* 方法一	关闭防火墙

​	systemctl stop/disable firewalld.service   

* 方法二	开启端口

​	①开启端口	firewall-cmd --zone=public --add-port=redis配置文件的端口号/tcp --permanent

​	②重启防火墙	firewall-cmd --reload

​	③查看端口是否开启成功	firewall-cmd --query-port=端口号/tcp

1.2	配置redis.conf文件

* 注释掉bind 127.0.0.1

* 修改protected-mode为no

### [2]	导入依赖

```
<dependency>
<groupId>redis.clients</groupId>
<artifactId>jedis</artifactId>
<version>3.2.0</version>
</dependency>
```

[3]	测试

```
import org.junit.Test;
import redis.clients.jedis.Jedis;
public class MyTest {
    @Test
    public void test(){
        String host = "149.28.137.190";	//服务器地址
        Integer port = 2333;	//端口号
        Jedis jedis = new Jedis(host,port);
        String ping = jedis.ping();
        System.out.println(ping);	//pong
        
        jedis.set("k1","v1");
        String v1 = jedis.get("k1");
    }
}
```

### [3]	使用JedisPool

> Jedis不是线程安全的,所以一般和线程池使用

```
public class JedisPoolUtil {
    private static JedisPool pool;
    
    public static JedisPool getResource(String host, Integer port) {
        //首先判断是否已经存在pool
        if (pool == null) {
            //首先需要创建config对象来配置线程池
            JedisPoolConfig config = new JedisPoolConfig();
            //设置最大线程数,一个线程就是一个Jedis
            config.setMaxTotal(20);
            //设置最大空闲数
            config.setMaxIdle(2);
            //设置检查项为true,表示从线程池取到的对象一定是可用的
            config.setTestOnBorrow(true);
            //...
            
            //创建JedisPool对象
            pool = new JedisPool(config,host,port,6000,"123密码(没有设置可不填)");
        }
        return pool;
    }

    public static void  close(){
        if (pool != null){
            pool.close();
        }
    }
}
```

```
public class JedisTest {
    public static void main(String[] args) {
        String host = "149.28.137.190";
        Integer port = 2333;
        JedisPool pool = null;
        Jedis jedis = null;
        try {
            pool = JedisPoolUtil.getPool(host,port);
            jedis = pool.getResource();
            String ping = jedis.ping();
            System.out.println(ping);
            //....
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            jedis.close();
        }
    }
}
```



## 四、事务

> redis的事务不同于mysql，redis的事务分为两个步骤：把输入命令排队列，直到执行语句exec执行后，才开始执行队列中的语句

### [1]	开启事务

```
127.0.0.1:6379> multi	//执行后之后执行命令会进入队列
ok
127.0.0.1:6379> set k1 v1
QUEUED
127.0.0.1:6379> set k2 v2
QUEUED
```



### [2]	提交事务

```
127.0.0.1:6379> exec	//执行所有处于队列中的命令
1) ok
2) ok
```



### [3]	事务的错误处理

* 组队中(multi但未exec)	某个命令出现了报告错误，执行时整个的所有队列都会被取消
* 执行中(exec)	某个命令报出了错误，则只有报错的命令不会被执行，而其他的命令都会执行，不回滚。



### [4]	乐观锁解决事务冲突

watch key [key ...]

在执行multi之前，先执行watch key1 [key2],可以监视一个(或多个) key ，如果在事务执行之前这个(或这些) key 被其他命令所改动，那么事务将被打断。

unwatch key [key ...]

取消 WATCH 命令对所有 key 的监视。
如果在执行 WATCH 命令之后，EXEC 命令或DISCARD 命令先被执行了的话，那么就不需要再执行UNWATCH 了。



## 五、持久化操作

> Redis中存储的数据是在内存中的，一旦服务器关闭数据就会消失，为了保存数据就需要持久化操作，把内存中的数据以某种方式保存到硬盘中。
>
> Redis主要有两种方式，一是RDB，在特定时间间隔内把数据已二进制形式保存，默认名称dump.rdb；二是AOF，以日志的形式，保存所有执行的写操作语句，默认为appendonly.aof文件。
>
> Redis服务启动时，会自动读取这些文件加载数据到内存中

### [1]	RDB策略

redis默认使用的持久化策略。在指定的时间间隔内将内存中的数据集快照写入磁盘默认是dump.rdb文件， 也就是行话讲的Snapshot快照，它恢复时是将快照文件直接读到内存里

1.1	redis.conf中RDB相关配置

* dbfilename dump.rdb	持久化文件默认名称

* dir ./	rdb文件的保存路径,默认为当前路径,也就是redis启动时命令行所在的目录下

* save 3600 1 	表示3600秒内有1个以上key改变，进行RDB持久化，保存到硬盘中

  save 20 3		表示在20秒内3个以上key改变时，进行RDB持久化操作

  save xx xx		这种策略可以多个共存配置

* stop-writes-on-bgsave-error  当Redis无法写入磁盘的话，直接关掉Redis的写操作。推荐yes



1.2	禁用RDB策略

方法一	动态停止RDB：redis-cli config set save "" 

方法二	在配置文件中#save后给空值



### [2]	AOF策略

> AOF默认不开启

2.1	redis.conf中AOF相关配置

* appendonly no	改为yes开启
* AOF同步频率设置
  * appendfsync always 每次Redis的写入都会立刻记入日志
  * appendfsync everysec 每秒记入日志一次
  * appendfsync no 不主动进行同步，把同步时机交给操作系统(一般是每30秒一次)

2.2	AOF和RDB同时开启，redis听谁的

AOF和RDB同时开启，系统默认取AOF的数据（数据不会存在丢失）

2.3	AOF文件损害修复

```
通过/usr/local/bin/redis-check-aof--fix appendonly.aof修复
```



## 六、主从复制

> 多台服务器redis，一台为主,其他为从。主机执行写操作，从机执行读操作，实现读写分离
>
> 在主机进行set等写操作时，数据会自动同步到从机中。在从机只能进行读操作，写操作会报错。

### [1]	模拟主从复制

1.1	创建3份文件，分别命名为redis6380.conf、redis6382.conf、redis6384.conf。其中redis6380.conf将作为主机，其余为从机

1.2	配置文件内容，以redis6380.conf为例。其余的文件只要修改对应的数字即可

```
include /root/copy/redis.conf
pidfile /var/run/redis_6380.pid
port 6380
dbfilename dump6380.rdb
```

模板

```
拷贝多个redis.conf文件include(写绝对路径)
开启daemonize yes
Pid文件名字pidfile
指定端口port
Log文件名字
dump.rdb名字dbfilename
Appendonly 关掉或者换名字
```

1.3	启动三个redis服务

```
redis-server redis6380.conf
redis-server redis6382.conf
redis-server redis6384.conf
```

1.4	分别在三个窗口连接

```
redis-cli -p 6380	//窗口一
redis-cli -p 6382	//窗口二
redis-cli -p 6384	//窗口三
```

1.5	连接上之后，查看运行情况

```
info replication	//可以看到三个role都是master
```

1.6	配置主主从关系

slaveof 主机地址 端口号

```
127.0.0.1:6382>slave 127.0.0.1 6380
```

```
127.0.0.1:6384>slave 127.0.0.1 6380
```

1.7	再次查看运行情况

```
info replication	//6380的role是master 其他role都是slave

```



### [2]	关系说明

slaveof  no one	设置当前为主机



1.1	一主多仆

一个主机多个从机，当主机宕机时，其他从机还是维持现状，无法写操作。可以手动把某个从机修改为主机

1.2	薪火相传

上一个Slave可以是下一个slave的Master，Slave同样可以接收其他 slaves的连接和同步请求，那么该slave作为了链条中下一个的master, 可以有效减轻master的写压力,去中心化降低风险

1.3	反客为主

当一个master宕机后，后面的slave可以立刻升为master，其后面的slave不用做任何修改。



### [3]	哨兵模式(sentinel)

反客为主的自动版，能够后台监控主机是否故障，如果故障了根据投票数自动将从库转换为主库

3.1	配置文件

创建3份sentinel.conf文件分别命名，sentinel26380.conf，sentinel26381.conf，sentinel26382.conf内容如下

```
sentinel monitor mymaster 127.0.0.1 6380 2
port 26380
//其中mymaster为监控对象起的服务器名称， 2 为至少有多少个哨兵同意迁移的数量。

```

3.2	启动哨兵

在上面主从复制的运行环境下，新开3个窗口，进入/usr/local/bin，分别执行

```
redis-sentinel /root/copy/sentinel26380.conf	//路径以自己的配置文件位置为准
redis-sentinel /root/copy/sentinel26381.conf
redis-sentinel /root/copy/sentinel26382.conf

```

3.3	当主机挂掉，从机选举中产生新的主机

(大概10秒左右可以看到哨兵窗口日志，切换了新的主机)

根据优先级别：slave-priority值越小优先级越高 原主机重启后会变为从机。

3.3	哨兵必须为奇数个，因为是通过投票方式来决定主机的



## 七、集群

> 集群至少需要6个服务器，3份一主一从

### [1]	相关配置文件

1.1	在主从复制配置的基础上

```
include /root/copy/redis.conf
pidfile /var/run/redis_6380.pid
port 6380
dbfilename dump6380.rdb

cluster-enabled yes  打开集群模式
cluster-config-file nodes-6380.conf	设定节点配置文件名
cluster-node-timeout 15000 设定节点失联时间，超过该时间（毫秒），集群自动进行主从切换。

```

创建6个不同端口的配置文件

1.2	启动6个redis服务	启动成功会生成6个nodes-xxxx.conf文件

1.3	组合之前，请确保所有redis实例启动后，nodes-xxxx.conf文件都生成正常

1.4	进入redis安装目录的src下	执行

```
redis-cli --cluster create --cluster-replicas 1 192.168.11.101:6379 192.168.11.101:6380 192.168.11.101:6381 192.168.11.101:6389 192.168.11.101:6390 192.168.11.101:6391

此处不要用127.0.0.1， 请用真实IP地址
--replicas 1 采用最简单的方式配置集群，一台主机，一台从机，正好三组。

```

1.5	-c 采用集群策略连接，设置数据会自动切换到相应的写主机

```
redis-cli -c -p 6379

```

1.6	通过 cluster nodes 命令查看集群信息



### [2]	插槽slots

集群中set key存储值时，通过某种算法计算key的插槽值来决定存到哪个主机

集群使用公式 CRC16(key) % 16384 来计算键 key 属于哪个槽， 其中 CRC16(key) 语句用于计算键 key 的 CRC16 校验和 。

一个 Redis 集群包含 16384 个插槽（hash slot）， 数据库中的每个键都属于这 16384 个插槽的其中一个

2.1	集群使用mset mget

在集群中不能直接使用多键操作，可以通过取组名的形式来操作

```
mset k1{cust} v1 k2{cust} v2 k3{cust} v3
```

通过{}来定义组的概念，从而使key中{}内相同内容的键值对放到一个slot中去



2.2	查询集群中的值

CLUSTER GETKEYSINSLOT <slot><count> 返回 count 个 slot 槽中的键



### [3]	集群的Jedis开发

```
public class JedisClusterTest {
  public static void main(String[] args) { 
     Set<HostAndPort>set =new HashSet<HostAndPort>();
     set.add(new HostAndPort("192.168.31.211",6379));
     JedisCluster jedisCluster=new JedisCluster(set);
     jedisCluster.set("k1", "v1");
     System.out.println(jedisCluster.get("k1"));
  }

```



## 八、安全设置

### [1]	ACL

Redis ACL是Access Control List（访问控制列表）的缩写，该功能允许根据可以执行的命令和可以访问的键来限制某些连接。

（1）接入权限:用户名和密码 

（2）可以执行的命令 

（3）可以操作的 KEY



1.1	使用acl list命令展现用户权限列表

```
127.0.0.1:6379> acl list
1) "user default on nopass ~* +@all"
//--------
default	用户名
on	是否启用
nopass 密码,此处表示没密码
~*	可操作的key,此处表示所有
+@all	可执行的命令,此处表示所有
```

1.2	使用acl cat命令可以查看添加权限指令类别

1.3	使用acl whoami命令查看当前用户

```
127.0.0.1:6379> acl whoami
"default"
```

1.4	可以通过命令创建新用户默认权限

```
acl setuser user1
```

1.5	设置有用户名、密码、ACL权限、并启用的用户

```
acl setuser user2 on >password ~cached:* +get
```

1.6	切换用户，验证权限

```
auth user2 password
```

1.7	带密码登录redis-cli

```
redis-cli -a 1234
```

或者进入终端后再输入密码

```
127.0.0.1:6379>auth 1234
```

