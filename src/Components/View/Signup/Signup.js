import React, { Component } from "react";
import "./Signup.css";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      pass: "",
      pass2: "",
      email: "",
      nickname: "",
      sex: "",
      checked_id: false, // ID 중복검사
      checked_nick: false,
      checked_email: false, // 메일 인증 확인
      authNum: "", //보낸 인증번호
      authCheckNum: "", // 사용자가 적은 인증번호
      sendEmailClick: false,
      open1: false,
      open2: false,
      open3: false,
    };
  }

  modalopen1 = (e) => {
    e.preventDefault();
    this.setState({
      open1: true,
    });
  };
  modalclose1 = (e) => {
    e.preventDefault();
    this.setState({
      open1: false,
    });
  };
  modalopen2 = (e) => {
    e.preventDefault();
    this.setState({
      open2: true,
    });
  };
  modalclose2 = (e) => {
    e.preventDefault();
    this.setState({
      open2: false,
    });
  };
  modalopen3 = (e) => {
    e.preventDefault();
    this.setState({
      open3: true,
    });
  };
  modalclose3 = (e) => {
    e.preventDefault();
    this.setState({
      open3: false,
    });
  };
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  sendEmail = (e) => {
    e.preventDefault();
    this.setState({
      sendEmailClick: true,
    });
    const email = {
      sendEmail: this.state.email,
    };
    // console.log(email);
    fetch("api/Sendmail", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(email),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json === true) {
          // alert("이미 가입된 메일입니다.");
          this.setState({
            open2: true,
            text2: "이미 가입된 메일입니다.",
          });
        } else {
          // alert("인증 메일이 전송되었습니다.");
          this.setState({
            open2: true,
            text2: "인증 메일이 전송되었습니다.",
          });

          this.setState({
            authNum: json,
          });
        }
      });
  };
  // 인증메일을 확인한다.
  authEmail = (e) => {
    e.preventDefault();
    if (this.state.authNum.toString() === this.state.authCheckNum.toString()) {
      this.setState({
        open2: true,
        text2: "인증성공",
      });
      this.setState({
        checked_email: true,
      });
    } else {
      this.setState({
        open2: true,
        text2: "인증 실패",
      });
    }
  };

  check = (re, what, message) => {
    if (re.test(what)) {
      return true;
    }
    this.setState({
      open1: true,
      text1: message,
    });
    return false;
  };

  checkId = (e) => {
    e.preventDefault();
    var re = /^[a-zA-Z0-9]{4,12}$/; //아이디는 4~12자의 영문 대소문자와 숫자로만 입력
    if (
      !this.check(
        re,
        this.state._id,
        "아이디는 4~12자의 영문 대소문자와 숫자로만 입력가능합니다."
      )
    ) {
      return false;
    } else {
      const checkId = {
        check_Id: this.state._id,
      };
      fetch("api/CheckId", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(checkId),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json) {
            this.setState({
              open1: true,
              text1: "사용 가능한 아이디 입니다.",
            });
            this.setState({
              checked_id: true,
            });
          } else {
            this.setState({
              open1: true,
              text1: "이미 사용중인 아이디 입니다.",
            });
          }
        });
    }
  };
  //닉네임 중복검사
  checkNick = (e) => {
    e.preventDefault();
    var re = /^[a-zA-z가-힣0-9]{2,8}$/;
    if (
      !this.check(
        re,
        this.state.nickname,
        "닉네임은 2~8자의 영문 한글 숫자로만 <br/>입력가능합니다."
      )
    ) {
      return false;
    } else {
      const checkNick = {
        check_Nick: this.state.nickname,
      };
      fetch("api/CheckNick", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(checkNick),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json) {
            alert("사용가능한 닉네임 입니다.");
            this.setState({
              checked_nick: true,
            });
          } else {
            alert("이미 사용중인 닉네임 입니다.");
          }
        });
    }
  };
  moveLogin = (e) => {
    e.preventDefault();
    window.location.replace("/");
  };

  onSubmit = (e) => {
    e.preventDefault(); //이벤트 발생시 새로고침을 안하게 한다.
    if (!this.state.checked_id) {
      this.setState({
        open2: true,
        text2: "아이디 중복 검사를 해주세요",
      });
    } else if (!(this.state.pass === this.state.pass2)) {
      this.setState({
        open2: true,
        text2: "비밀번호가 일치하지 않습니다.",
      });
    } else if (!this.state.checked_email) {
      this.setState({
        open2: true,
        text2: "메일 인증을 해주세요.",
      });
    } else if (this.state.sex === "") {
      this.setState({
        open2: true,
        text2: "성별 채크를 해주세요.",
      });
    } else {
      const user_info = {
        _id: this.state._id,
        pass: this.state.pass,
        pass2: this.state.pass2,
        email: this.state.email,
        nick: this.state.nickname,
        sex: this.state.sex,
      };
      fetch("api/Signup", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(user_info),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json) {
            this.setState({
              open3: true,
              text3: "회원가입 성공",
            });
            window.location.href = "/";
          } else {
            this.setState({
              open3: true,
              text3: "회원가입 실패",
            });
          }
        });
    }
  };

  render() {
    return (
      <div className="White_sign">
        <Dialog
          open={this.state.open1}
          onClose={this.modalclose1}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.text1}
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.open2}
          onClose={this.modalclose2}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.text2}
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.open3}
          onClose={this.modalclose3}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title2">{this.state.text3}</DialogTitle>
        </Dialog>
        <form className="Container_sign" onSubmit={this.onSubmit}>
          <div className="Textbox_sign" style={{ marginTop: "15px" }}>
            <text className="Intro_sign">창원대 과팅앱</text>
          </div>
          <div className="Textbox_sign">
            <text className="Intro2_sign">와글와글</text>
          </div>
          <div className="Text_sign">
            <label for="name">아이디 </label>
            <input
              type="text"
              id="name"
              name="_id"
              value={this.state._id}
              onChange={this.handleChange}
              className="Input_sign"
            />
            {/* <input
              type="button"
              value="중복확인"
              onClick={this.checkId}
              className="Double_sign"
            /> */}
            <button className="Double_sign" onClick={this.checkId}>
              중복확인
            </button>
          </div>

          <div className="Text_sign">
            <label for="pass">비밀번호 </label>
            <input
              type="password"
              id="pass"
              name="pass"
              value={this.state.pass}
              onChange={this.handleChange}
              className="Input_sign"
            />
          </div>

          <div className="Text_sign">
            <label for="pass2">비밀번호 확인 </label>
            <input
              type="password"
              id="pass2"
              name="pass2"
              value={this.state.pass2}
              onChange={this.handleChange}
              className="Input_sign"
            />
          </div>

          <div className="Text_sign2">
            <div className="sex_label">
              <label for="nickname">성별 </label>
            </div>
            <div className="sex_div">
              <input
                type="radio"
                name="sex"
                value="M"
                onChange={this.handleChange}
                className="sex_button"
              />{" "}
              남
              <input
                type="radio"
                name="sex"
                value="F"
                onChange={this.handleChange}
                className="sex_button"
              />{" "}
              여
            </div>
          </div>

          <div className="Text_sign">
            <label for="email">학교메일 </label>
            <input
              type="text"
              id="email"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
              className="Input_sign_email"
            />
            <span className="email_text">@changwon.ac.kr</span>

            <button onClick={this.sendEmail} className="Double_sign">
              전송
            </button>
          </div>
          {this.state.sendEmailClick ? (
            <div className="Text_sign">
              <label for="authCheckNum">인증번호 </label>
              <input
                type="text"
                id="authCheckNum"
                name="authCheckNum"
                value={this.state.authCheckNum}
                onChange={this.handleChange}
                className="Input_sign"
              />
              <button onClick={this.authEmail} className="Double_sign">
                확인
              </button>
            </div>
          ) : (
            <div></div>
          )}

          <div className="btn_sigh">
            <button className="Btn_sign" type="submit">
              회원가입
            </button>
            <button className="Btn_sign" onClick={this.moveLogin}>
              로그인
            </button>
          </div>
        </form>
      </div>
    );
  }
}
