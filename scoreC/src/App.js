import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'proptypes';
import {connect} from 'react-redux';
import {Form} from 'antd';
import axios from 'axios';
import config from './config';
import './App.css';

const FormItem = Form.Item;

class App extends Component {
  static contextTypes ={
    router:PropTypes.object,
  }

  componentWillMount(){
    
  }

  login = (e) =>{
    e.preventDefault();
    let his = this.context.router.history;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if( values.number === 'admin' ){
          axios.post(config.URL_S+'adminLogin')
          .then(res =>{
            if(res.data.auth === 1){
              this.props.login('admin');
              his.push('/main');
            }else{
              alert('已有其他评委登录');
            }
          })
        }else{
          axios.post(config.URL_S+'login', { number: values.number })
          .then(res => {
            let auth = res.data.auth;
            if( auth === 1 ){
              this.props.login( values.number);
              his.push('/animate');
            }else{
              alert('登录失败！请检查号码是否正确或者管理员是否已经开始初始化！');
            }
          })
        }
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Card className="login-box">
      <Form onSubmit={this.login}>
      <CardContent className="login-acnt">
      <FormItem>
          {getFieldDecorator('number')(
            <TextField
              id="outlined-with-placeholder"
              label="登录号码"
              placeholder="登录号码"
              margin="normal"
              variant="outlined"
              fullWidth
            />
          )}
      </FormItem>
      </CardContent>
      <FormItem>
        <Button variant="contained" color="primary" className="login-btn" type="submit">
          登录
        </Button>
      </FormItem>
      </Form>
      </Card>
    );
  }
}

function mapStateToProps(state){
  return{
    state:state
  }
}

function mapDispatchToProps(dispatch){
  return {
    login(num){
      dispatch({type:'LOGIN_SUC',num});
    }
  }
}

export default Form.create()(connect(mapStateToProps,mapDispatchToProps)(App));
