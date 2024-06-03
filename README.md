# Hướng dẫn deploy web Health_Insurance lên AWS
## Bước 1: Tạo Virtual Private Cloud (VPC)
- Ở phần đầu AWS Management Console, tìm kiếm VPC và chọn
- Create VPC và cấu hình như sau:
   - Resources to create: Choose VPC only
   - Name tag: myvpc
   - IPv4 CIDR: 10.0.0.0/16
   - Choose Create VPC
## Bước 2: Tạo các thành phần con của VPC
- Internet Gateway:
   - Chọn Create internet gateway
     + NameTag: myIGW
     + Choses create internet gateway
  
   - Sau khi tạo ở thanh thông báo phía trên, chọn attach to VPC:
     + Available VPCs: Choose VPCThatWeCreated
     + Choose Attach internet gateway
  
- Subnets: VPC ID chọn myvpc,tạo các subnets:
   - Public Subnet 1: 
      + Availability Zone: us-east-1a
      + IPv4 subnet CIDR block: 10.0.1.0/24
  
   - Public Subnet 2:
      + Availability Zone: us-east-1b
      + IPv4 subnet CIDR block: 10.0.2.0/24

   - Private Subnet 1:
      + Availability Zone: us-east-1a
      + IPv4 subnet CIDR block: 10.0.3.0/24

   - Private Subnet 2:
      + Availability Zone: us-east-1b
      + IPv4 subnet CIDR block: 10.0.4.0/24

- Route Tables: Tạo public-RT và private-RT
   - public-RT:
      + VPC: chọn myvpc
      + Chọn Create route table
      + Sau khi tạo vào Subnet associations => edit subnet associations
      + Thêm Public Subnet 1 và Public Subnet 2
      + Save associations
      + Ở tab bên dưới, chọn Router => Edit router
      + Cài Destiation : 0.0.0.0/0 và Target : myIGW (internet gateway)

   - private-RT
      + VPC: chọn myvpc
      + Chọn Create route table
      + Sau khi tạo vào Subnet associations => edit subnet associations
      + Thêm Private Subnet 1 và Private Subnet 2
      + Save associations
  
## Bước 3: Tạo một máy ảo trên dịch vụ EC2 của AWS
- Trong giao diện điều khiển, tìm và chọn dịch vụ "EC2" trong danh sách các dịch vụ của AWS
- Bấm vào nút "Launch Instance" để bắt đầu quá trình tạo instance mới.
- Đặt tên cho máy ảo (Web-Health-Insurance)
- Chọn AMI muốn sử dụng (Amazon Linux AMI 2023)
- Chọn loại instance(t2.micro)
- Chọn key pair (login): Vockey (type: rsa)
- Ở phần Network settings chọn Edit
  
  + VPC: Chọn myvpc
  + Auto-assign public IP: Chọn Enable
  + Security groups: 
  
    + Chọn Create security group
    + Security group name: My-SG

- Kiểm tra lại tất cả cài đặt và tùy chọn đã chọn. Sau đó, nhấn vào nút "Launch instance" để bắt đầu tạo máy ảo.
  
## Bước 4: Connect to instance 
- Select vào máy ảo vừa tạo, tiếp theo nhấn vào Connect ở phía trên
- Chọn EC2 Instance Connect, sau đó nhấn Connect

## Bước 5: Cấu hình cho các thư viện cần thiết của dự án

### Cấu hình database (MongoDB)
- Di chuyển đến thư mục /etc/yum.repos.d
  
  ```bash
  cd /etc/yum.repos.d
- Tạo một tập tin có tên là "mongodb-org-7.0.repo" trong thư mục hiện tại
  ```bash
  sudo touch mongodb-org-7.0.repo
- Mở tập tin "mongodb-org-7.0.repo" bằng trình soạn thảo nano
  ```bash
  sudo nano mongodb-org-7.0.repo
- Sau khi mở trình soạn thảo, gõ đoạn mã dưới đây rồi lưu lại:
  ```bash 
   [mongodb-org-7.0]
   name=MongoDB Repository
   baseurl=https://repo.mongodb.org/yum/amazon/2023/mongodb-org/7.0/x86_64/
   gpgcheck=1
   enabled=1
   gpgkey=https://pgp.mongodb.com/server-7.0.asc
- Install the MongoDB packages
  ```bash
  sudo yum install -y mongodb-org
- Start MongoDB
  ```bash
  sudo systemctl start mongod
- Verify that MongoDB has started successfully
  ```bash
  sudo systemctl status mongod
- Stop MongoDB
  ```bash
  sudo systemctl stop mongod
- Restart MongoDB.
  ```bash
  sudo systemctl restart mongod
- Begin using MongoDB
  ```bash
  mongosh
- Use Mydatabase in MongoDB
  ```bash
  use mydatabase
- Create My database
  ```bash
   db.createUser(
    {
        user: "admin",
        pwd:  passwordPrompt(),  
        roles: [ { role: "readWrite", db: "mydatabase" },
                { role: "read", db: "mydatabase" } ]
    }
   )
- Mở tập tin "/etc/mongod.conf" bằng trình soạn thảo nano:
  ```bash
  sudo nano /etc/mongod.conf
- Sau khi mở trình soạn thảo, sửa lại 2 dòng  đoạn mã như dưới đây rồi lưu lại:
  ```bash
  net:
    port: 27017
    bindIp: 0.0.0
- Restart và kiểm tra lại trạng thái của mongod:
  ```bash
    sudo systemctl restart mongod
    sudo systemctl status mongod
    sudo systemctl enable mongod
    sudo systemctl stop mongod 
    sudo systemctl restart mongod
- Kết nối tới cơ sở dữ liệu MongoDB từ một máy khách MongoDB Shell (mongosh).
  ```bash
  mongosh -u user -p password Public-IPv4-address/mydatabase
- Tải xuống MongoDB từ trình duyệt và connect đến MongoDB
  ```bash
  mongodb://user:passwork@Public-IPv4-address/mydatabase?directConnection=true&appName=mongosh+2.2.6
### Cấu hình NodeJS, Git
- Thiết lập NodeSource Repository
  ```bash
  curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
- Cài đặt Node.js
  ```bash
  sudo dnf install nodejs -y
- Cài đặt Git
  ```bash
  sudo yum install -y git
- Cài đặt npm
  ```bash
  sudo npm install
- Clone dự án từ github về
  ```bash
  git clone https://github.com/Ho-DucThanh/Web-Health-Insurance.git
- Di chuyển đến dự án
  ```bash
  cd Web-Health-Insurance
- Chạy dự án
  ```bash
  npm start
## Bước 6: Tạo Port range cho Dự án và Database
- Ở menu bên trái, dưới mục "Network & Security", chọn "Security Groups"
- Chọn create Security Group

    -  Security group name: My-SG
    -  VPC: myvpc

- Chọn "Inbound rules", sau đó nhấn "Edit inbound rules
- Chọn "Add rule" sau đó điền như sau:
 
  - Type: "Custom TCP", Protocol: "TCP", Port range: 27017, IP: 0.0.0.0  
  - Type: "Custom TCP", Protocol: "TCP", Port range: 3000, IP: 0.0.0.0
  -  Type: "SSH", Protocol: "TCP", Port range: 22, IP: 0.0.0.0
  -  Type: "HTTP", Protocol: "TCP", Port range: 80, IP: 0.0.0.0
   
- Cuối cùng nhấn Save rules


  






