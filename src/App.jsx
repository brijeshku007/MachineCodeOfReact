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
const ProtectedRoute = withAuth(Dashboard);
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
//calculator
import Calculator from './components/Calculator'

// HOOKS LEARNING IMPORTS
import UseStateExample from './hooks-learning/01-useState/UseStateExample'
import UseStatePractice from './hooks-learning/01-useState/UseStatePractice'
import LazyInitializationDemo from './hooks-learning/01-useState/LazyInitializationDemo'
import UseEffectExample from './hooks-learning/02-useEffect/UseEffectExample'
import UseEffectPractice from './hooks-learning/02-useEffect/UseEffectPractice'
import CleanupDemo from './hooks-learning/02-useEffect/CleanupDemo'
import DataFetchingDemo from './hooks-learning/02-useEffect/DataFetchingDemo'
import DebounceDemo from './hooks-learning/02-useEffect/DebounceDemo'
import EventListenerExplanation from './hooks-learning/02-useEffect/EventListenerExplanation'
import UseContextExample from './hooks-learning/03-useContext/UseContextExample'

// INTERMEDIATE HOOKS IMPORTS
import UseReducerExample from './hooks-learning/04-useReducer/UseReducerExample'
import UseReducerPractice from './hooks-learning/04-useReducer/UseReducerPractice'
import UseReducerSimpleExplanation from './hooks-learning/04-useReducer/UseReducerSimpleExplanation'
import UseReducerAnalogy from './hooks-learning/04-useReducer/UseReducerAnalogy'
import UseCallbackExample from './hooks-learning/05-useCallback/UseCallbackExample'
import UseCallbackPractice from './hooks-learning/05-useCallback/UseCallbackPractice'
import UseMemoExample from './hooks-learning/06-useMemo/UseMemoExample'
import UseRefExample from './hooks-learning/07-useRef/UseRefExample'

// CUSTOM HOOKS IMPORTS
import CustomHooksBasics from './hooks-learning/08-customHooks/CustomHooksBasics'
import CustomHooksPractice from './hooks-learning/08-customHooks/CustomHooksPractice'
function App() {
  return (
    <>
      {/* PREVIOUS COMPONENTS */}
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
      {/* <Provider store={store}>
      <PostsList></PostsList>
    </Provider> */}
      {/* <Calculator></Calculator> */}

      {/* HOOKS LEARNING - Uncomment one at a time to learn */}

      {/* useState Examples */}
      {/* <UseStateExample /> */}
      {/* <UseStatePractice /> */}
      {/* <LazyInitializationDemo /> */}

      {/* useEffect Examples */}
      {/* <UseEffectExample /> */}
      {/* <UseEffectPractice /> */}
      {/* <CleanupDemo /> */}
      {/* <EventListenerExplanation /> */}
      {/* <DataFetchingDemo /> */}
      {/* <DebounceDemo /> */}

      {/* useContext Examples */}
      {/* <UseContextExample /> */}

      {/* INTERMEDIATE HOOKS - Week 2 */}

      {/* useReducer Examples */}
      {/* <UseReducerExample /> */}
      {/* <UseReducerSimpleExplanation /> */}
      {/* <UseReducerAnalogy /> */}
      {/* <UseReducerPractice /> */}

      {/* useCallback Examples */}
      {/* <UseCallbackExample /> */}
      {/* <UseCallbackPractice /> */}

      {/* useMemo Examples */}
      {/* <UseMemoExample /> */}

      {/* useRef Examples */}
      {/* <UseRefExample /> */}

      {/* CUSTOM HOOKS - The Ultimate React Skill */}
      <CustomHooksBasics />
      {/* <CustomHooksPractice /> */}
    </>
  )
}

export default App
