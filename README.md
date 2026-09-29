## 镜像注册
```
注册淘宝镜像
npm config set registry https://registry.npmmirror.com
视图变更
alter view v_materialinfo as 
select r.Location ,r.Loading,r.LastModifyTime as UpTime ,m.* from materialinfo m 
inner join rackinfo r on r.PPID =m.PPID 

```