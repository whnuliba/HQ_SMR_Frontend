import { Alova } from '@/utils/http/alova/ids-request';

// 用户查询列表 (DbBaseController 默认方法)
export function getUserList(params) {
  return Alova.Post<BasicFmsResponseModel>(
    '/user/list',
    {
      ...params
    },
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

// 获取所有用户
export function getAllUsers() {
  return Alova.Post<BasicFmsResponseModel>(
    '/user/get-all',
    {},
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

// 添加用户 (DbBaseController Save 方法)
export function addUser(data) {
  return Alova.Post<BasicFmsResponseModel>(
    '/user/add',
    {
      ... data,
    },
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

// 修改用户
export function updateUser(data) {
  return Alova.Post<BasicFmsResponseModel>(
    '/user/edit',
    {
      ...data
    },
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

// 删除用户 (DbBaseController Delete 方法)
export function deleteUser(data) {
  return Alova.Post<BasicFmsResponseModel>(
    '/user/delete',
    {
      data: data,
    },
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

// 修改密码
export function updateUserPwd(data) {
  return Alova.Post<BasicFmsResponseModel>(
    '/user/UpdatePwd',
     {
      data: data,
    },
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

// 重置密码
export function resetUserPwd(data) {
  return Alova.Post<BasicFmsResponseModel>(
    '/user/reset-pwd',
    data,
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}
