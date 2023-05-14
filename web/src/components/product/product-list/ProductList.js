import React, { useEffect, useState } from 'react'
import productService from '../../../services/product'
import ProductItem from '../product-item/ProductItem'
import { useParams } from 'react-router-dom'
/************************ */
import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
/************************ */
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductList() {
  const { pantryId } = useParams()

  const [state, dispatch] = React.useReducer(reducer, {
    collection: [],
    toRemove: []
  });

  useEffect(() => {
    // console.log('productlist >> ', pantryId)
    productService.list(pantryId)
      .then((products) => {
        // console.log(products)
        dispatch({
          type: "UPDATE",
          products: products
        })
      })
      .catch((error) => {
        console.error(error)
        dispatch({
          type: "UPDATE",
          products: null
        })
      })
  }, [pantryId])

  if (!state.collection?.length) {
    return <></>
  }

  const leadingActions = (item) => (
    <LeadingActions>
      <SwipeAction onClick={() => {
        console.info(`swipe action triggered >>`, item)
      }}>
        Action name
      </SwipeAction>
    </LeadingActions>
  );

  const trailingActions = (item) => (
    <TrailingActions>
      <SwipeAction
        destructive={true}
        onClick={() => {
          // console.log('swipe action triggered >> ', item)
          removeRow(item)
        }}
      >
        <i className="fa fa-trash fa-3x ms-3" aria-hidden="true" style={{color: 'white'}}></i>
      </SwipeAction>
    </TrailingActions>
  );

  const Undo = ({ onUndo, closeToast, data }) => {
    const handleClick = () => {
      data.undo = true
      onUndo(data);
      closeToast();
    };

    return (
      <div>
        <span className='d-flex flex-row justify-content-between align-items-center'>
          Product will be deleted <button className='btn btn-dark' onClick={handleClick}>Better keep it</button>
        </span>
      </div>
    );
  };

  function undoEraseAnimation(action) {
    // console.log('undoEraseAnimation >> ', action)
    if (!document.getElementById(action.id)) {
      return
    }

    const item_trailing = document.getElementById(action.id).parentElement.parentElement.children[1]
    item_trailing.style.width = 0
    item_trailing.classList.remove('swipeable-list-item__trailing-actions--return')

    const item_content = document.getElementById(action.id).parentElement.parentElement.children[0]
    item_content.style.removeProperty('transform')
    item_content.classList.remove('swipeable-list-item__content--remove')

    const item = document.getElementById(action.id).parentElement.parentElement
    item.classList.remove('swipeable-list-item--remove')
  }

  function reducer(state, action) {
    switch (action.type) {
      case "QUEUE_FOR_REMOVAL":
        document.getElementsByClassName('right-bottom-btn')[0].firstElementChild.disabled = true

        return {
          collection: state.collection,
          toRemove: [...state.toRemove, action.id]
        };
      case "CLEAN_COLLECTION":
        const confirmClean = JSON.parse(JSON.stringify(state.toRemove))
          .includes(action.id);

        const newCleanCollection = confirmClean ? state.collection.filter(v => v.id !== action.id) : state.collection
        const newCleanToRemove = state.toRemove.filter(vId => vId !== action.id)

        document.getElementsByClassName('right-bottom-btn')[0].firstElementChild.disabled = newCleanToRemove.length

        return {
          collection: newCleanCollection,
          toRemove: newCleanToRemove
        }

      // return {
      //   collection: confirmClean ? state.collection.filter(v => v.id !== action.id) : state.collection, // original filter >> !state.toRemove.includes(v.id)
      //   toRemove: state.toRemove.filter(vId => vId !== action.id) // original toRemove >> []
      // }

      case "UNDO":

        undoEraseAnimation(action)

        const newUndoCollection = state.collection
        const newUndoToRemove = state.toRemove.filter(vId => vId !== action.id)

        document.getElementsByClassName('right-bottom-btn')[0].firstElementChild.disabled = newUndoToRemove.length

        return {
          collection: newUndoCollection,
          toRemove: newUndoToRemove
        };
      case "UPDATE":
        return {
          collection: action.products,
          toRemove: []
        }
      default:
        return state;
    }
  }

  const removeRow = (event) => {
    const id = event.target?.id || event.id
    // console.log('removeRow >> ', id)
    dispatch({ id, type: "QUEUE_FOR_REMOVAL" });

    toast.warning(
      <Undo
        onUndo={() => {
          dispatch({ id, type: "UNDO" })
        }}
      />,
      {
        data: { productId: id }
      }
    );

    toast.onChange((toastItem) => {
      switch (toastItem.status) {
        case "removed":
          // console.log('onchanged >> ', toastItem.data.productId , ' __ ' , toastItem.data.undo || false)
          if (!toastItem.data.undo) {
            productService.erase(pantryId, toastItem.data.productId)
              .then(() => {
                dispatch({ type: "CLEAN_COLLECTION", id: toastItem.data.productId })
              })
              .catch((error) => {
                console.log('An error ocurred while trying to delete product >> ', error)
                dispatch({ type: "UNDO", id: toastItem.data.productId })
              })
          }
          break;

        default:
          break;
      }
    })
  };

  const renderRows = () => {
    return state.collection
      // .filter(v => !state.toRemove.includes(v.id))
      .map(v => (
        <SwipeableListItem
          key={v.id}
          trailingActions={trailingActions(v)}
        >
          <ProductItem product={v} />
        </SwipeableListItem>
      ));
  };

  return (
    <>

      <div className='item-list'>

        <SwipeableList
          destructiveCallbackDelay={200}
          threshold={0.5}          
        >

          {renderRows()}
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            closeOnClick={false}
            closeButton={false}
          />
        </SwipeableList>

      </div>
    </>
  )
}

export default ProductList