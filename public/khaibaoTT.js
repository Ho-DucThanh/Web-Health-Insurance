class User_Infor {
    constructor(name, age, sex, phone, add, type, duration) {
      this.name = name;
      this.age = age;
      this.sex = sex;
      this.phone = phone;
      this.add = add;
      this.type = type;
    this.duration = duration;
    }
  
    isComplete() {
      return this.name && this.age && this.sex && this.phone && this.add && this.type && this.duration
        ? true
        : false;
    }
  
    isValidName(name) {
      const nameRegex = /^[a-zA-Z\s]+$/;
      return nameRegex.test(name);
    }
  
    isValidAge(age) {
      return Number.isInteger(age) && age > 0 && age < 101;
    }
  
    isValidSex(sex) {
      return sex === "Nam" || sex === "Nữ";
    }
  
    isValidPhone(phone) {
      const phoneRegex = /^0\d{9}$/;
      return phoneRegex.test(phone);
    }
  
    isValidAddress(add) {
      const addressRegex = /^[a-zA-Z0-9\s]+$/;
      return addressRegex.test(add);
    }

    isValidType() {
        const validTypes = ["vip", "thường"];
        return validTypes.includes(this.type.toLowerCase());
      }
    
      isValidDuration() {
        return (
          Number.isInteger(this.duration) &&
          this.duration >= 1 &&
          this.duration <= 5
        );
      }

      calculateInsuranceCost() {
        const costPerYear = this.type.toLowerCase() === "vip" ? 800000 : 500000;
        return costPerYear * this.duration;
      }

    isValidUser() {
      return (
        this.isComplete() &&
        this.isValidName(this.name) &&
        this.isValidAge(this.age) &&
        this.isValidSex(this.sex) &&
        this.isValidPhone(this.phone) &&
        this.isValidAddress(this.add) &&
        this.isValidType() && this.isValidDuration()
      );
    }
  }
  
  export default User_Infor;
  