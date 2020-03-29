const permissions = {
  // USER PERMISSIONS
  "user_create": {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: false},
  "user_list": {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: false},
  "user_edit": {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: false},

  // TOKEN PERMISSIONS
  "call_token": {ROLE_ADMIN: true, ROLE_STAFF: true, ROLE_TOKENIST: false},
  "create_token": {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: true},

  //REPORT PERMISSIONS
  "report_user": {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: false},
  "report_overall": {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: false},
  "report_served": {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: false},

  //CUSTOMER PERMISSIONS
  "customer_create": {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: true},
  "customer_list": {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: true},
  "customer_edit": {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: true},

  //COUNTER PERMISSIONS
  "counter_create": {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: false},
  "counter_list": {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: false},
  "counter_edit": {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: false},

  //DISPLAY PERMISSIONS
  "display_create": {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: true},
  "display_list": {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: true},
  "display_edit": {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: true},
  "display_show": {ROLE_ADMIN: false, ROLE_STAFF: true, ROLE_TOKENIST: false},

  //DEPARTMENT PERMISSIONS
  "department_create": {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: false},
  "department_list": {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: false},
  "department_edit": {ROLE_ADMIN: true, ROLE_STAFF: false, ROLE_TOKENIST: false},
};

export function checkPermission(pathname) {
  // first split the pathname
  const split_path = pathname.split('/');
  if (split_path.length > 2){
    const join_path = split_path[1]+'_'+split_path[2];
    const token_user = JSON.parse(localStorage.getItem('token_user'));

    return permissions[join_path][token_user.roles[0]];
  }
  return true;

}
