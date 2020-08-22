import React, { useState, useRef, memo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Motion, spring } from 'react-motion';
import './Main.css';

import firebase from 'firebase'
import './firebase'

const Main = memo( () => {
  const [popup, setPopup] = useState(false);
  const [value, setValue] = useState('');
  const [code, setCode] = useState('');
  const [seat, setSeat] = useState([]);
  const [seats, setSeats] = useState([])
  const [users, setUsers] = useState(false);
  const [usersName, setUsersName] = useState('');
  const [state, setState] = useState(false);

  const motionOpacity = { stiffness: 50, daping: 0, precision: 0 }
  const motionPosition = { stiffness: 60, daping: 30, precision: 0 }

  const onClickPopup = () => {
    setPopup(true)
  }

  const onClickXbutton = () => {
    setPopup(false)
    setValue('');
    setCode('')
    setSeat([])
    setUsers(false);
  }

  const onClickStart = () => {
    if(window.confirm('시작하시겠습니까 ?') === true) {
      firebase.database().ref().child('/'+code).update({
        start: true
      })
      setState(true)
    }
    else {
      return false
    }
  }

  const onClickEnd = () => {
    if(window.confirm('종료하시겠습니까 ?') === true) {
      firebase.database().ref('/' + code).remove();
      window.location.reload();
    }
    else {
      return false
    }
  }

  const onChangeInput = (e) => {
    setValue(e.target.value)
  }

  const getCode = () => {
    let tempCode = []
    for(let i = 0; i < 6; i+=1) {
      tempCode.push(Math.floor(Math.random() * 10))
    }
    return tempCode.join('')
  }

  const onSubmitPeople = (e) => {
    e.preventDefault()
    if(window.confirm(value+'명이 맞습니까?') === true) {
      setPopup(false)
      let codeName = getCode()
      setCode(codeName)
      for(let i = 0; i < value; i+=1) {
        seat.push('')
        seats.push(' ')
      }
      let setData = {
        seat,
        start: false,
        userNames: '',
        userNum: {
          now: Math.floor(value),
          max: Math.floor(value)
        }
      }
      setSeat([])
      console.log(setData)
      firebase.database().ref('/'+ codeName).set(setData)
      firebase.database().ref('/' + codeName).on('child_added', (snap) => {
        setUsers(snap.val().max - snap.val().now)
      })
    }
    else {
      return false
    }
  }

  firebase.database().ref('/' + code + '/userNum').on('child_changed', (snap) => {
    setUsers(Math.floor(value)-snap.val())
    firebase.database().ref('/' + code + '/userNames').on('value', (snap) => {
      setUsersName(snap.val())
    })
  })

  firebase.database().ref('/' + code + '/seat').on('child_changed', (snap) => {
    firebase.database().ref('/' + code + '/seat').on('value', (snap) => {
      setSeats(snap.val())
    }) 
  })

  return (
    <BrowserRouter>
      <Motion defaultStyle={{left: -10, opacity: 0}} style={{left: spring(20, motionPosition), opacity: spring(1, motionOpacity)}}>
        {
          (style) => (<div style={{opacity: style.opacity, left: style.left}} className="header">
            블루베리
            <div className="headerInner"></div>
          </div>)
        }
      </Motion>
      {
        code === '' && (
          <Motion defaultStyle={{right: -10, opacity: 0}} style={{right: spring(30, motionPosition), opacity: spring(1, motionOpacity)}}>
          {
            (style) => (<div style={{opacity: style.opacity, right: style.right}} onClick={onClickPopup} className="plus">+</div>)
          }
          </Motion>
        )
      }
      {
        popup === true && (
          <>
            <div onClick={onClickXbutton} className="popupWrapper"></div>
            <div className="popup">
              <div onClick={onClickXbutton} className="xButton">X</div>
              <div className="popupName">최대 인원수</div>
              <form className="popupForm" onSubmit={onSubmitPeople}>
                <input max="21" min="1" className="popupInput" type="number" onChange={onChangeInput} placeholder="1 ~ 21" />
                <button className="popupButton">설정하기</button>
              </form>
            </div>
          </>
        )
      }
      <div className="codeName">{code}</div>
      {users !== false && (
        <>
          <div className="users">{users} / {value}</div>
          <div className="usersName">{usersName}</div>
          <button onClick={onClickStart} className="startButton">시작하기</button>
        </>
        ) 
      }
      {
        state === true && (
          <div className="realtime">  
            <div className="raeltimeWrapper">
              {seats.map((v, i) => {
                return (
                  <div key={i} className="seats">{v}</div>
                )
              })}
            </div>
            <button className="buttonEnd" onClick={onClickEnd}>종료</button>
          </div>
        )
      }
    </BrowserRouter>
  )
})

export default Main;