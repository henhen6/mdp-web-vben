export namespace UserModel {
  export interface OrgResultVO {
    // 当前租户下，所属单位
    companyList: any[];
    // 当前租户下和单位下，所属部门
    deptList: any[];
    // 当前单位ID
    currentCompanyId: string;
    // 当前部门ID
    currentDeptId: string;
  }

  export interface DefUserBaseInfoUpdateVO {
    id: string;
    nickName: string;
    sex: string;
    nation: string;
    education: string;
    workDescribe: string;
  }

  export interface DefUserPasswordUpdateVO {
    id: string;
    oldPassword: string;
    password: string;
    confirmPassword: string;
  }

  export interface DefUserMobileUpdateVO {
    mobile: string;
    code: string;
    templateCode: string;
  }

  export interface DefUserEmailUpdateVO {
    email: string;
    code: string;
    templateCode: string;
  }
}
