const BaseService = require("./BaseService");
const BaseModel = require("../models/Users");
class Users extends BaseService {
  constructor() {
    super(BaseModel);
  }
  // list(where)  {
  //   return BaseModel.find(where || {}).populate({
  //     path: "user_id",
  //     select: "full_name email profile_image",
  //   });
  // };
}

module.exports = Users;
