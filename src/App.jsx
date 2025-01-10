import { useState } from 'react'
import Counter from './components/Counter'
import SearchFilter from './components/SearchFilter'
import Todo from './components/Todo'
import Modal from './components/Model'
import DebouncedInput from './components/DebouncedInput'
import Tabs from './components/Tabs'
import FetchUsers from './components/FetchUsers'
import StopWatch from './components/StopWatch'
import LoginForm from './components/LoginForm'
import ThemeToggle from './components/ThemeToggle'
import Pagination from './components/Pagination'
import DragAndDrop from './components/DragAndDrop'
import Accordion from './components/Accordion'
import InfiniteScroll from './components/InfiniteScroll'
import ParentComponent from './components/ParentComponent'
// now learning about heigher order componnet
import withAuth from './components/higherOrderComo/withAuth'
import Dashboard from './components/higherOrderComo/Dashboard'
//making heigher order components
const ProtectedRoute=withAuth(Dashboard);
//end higer order component

//learing about contextapi
import Main from './components/contextApi/Main'
import Navbar from './components/contextApi/NavBar'
//custom hook
import Master from './components/customHook/Master'
//routing
import MainCompo from './components/routing/MainComp'
//rdduxtoolkit
import { store } from './reduxToolkit/store'
import { Provider } from 'react-redux'
import PostsList from './reduxToolkit/PostsList'
function App() {
  return (
    <>
    {/* <Counter></Counter> */}
    {/* <SearchFilter></SearchFilter> */}
    {/* <Todo></Todo> */}
    {/* <Modal></Modal> */}
    {/* <DebouncedInput></DebouncedInput> */}
    {/* <Tabs></Tabs> */}
    {/* <FetchUsers></FetchUsers> */}
    {/* <StopWatch></StopWatch> */}
    {/* <LoginForm></LoginForm> */}
    {/* <ThemeToggle></ThemeToggle> */}
    {/* <Pagination></Pagination> */}
    {/* <DragAndDrop></DragAndDrop> */}
    {/* <Accordion></Accordion> */}
    {/* <InfiniteScroll></InfiniteScroll> */}
    {/* <ParentComponent></ParentComponent> */}
    {/* <ProtectedRoute></ProtectedRoute> */}
    {/* <Navbar></Navbar>
    <Main></Main> */}
    {/* <Master></Master> */}
    {/* <MainCompo></MainCompo> */}
    <Provider store={store}>
      <PostsList></PostsList>
    </Provider>
   
    </>
  )
}

export default App
