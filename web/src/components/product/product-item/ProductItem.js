import React from 'react'
import './ProductItem.css'
import defaultImage from '../../../assets/images/food.jpg'
import moment from 'moment'

moment.updateLocale('es', {
  monthsShort: [
    "Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.",
    "Ago.", "Sept.", "Oct.", "Nov.", "Dic."
  ]
});

function ProductItem({ product, onClick: handleClick }) {
  return (
    <>
      <div className="card" style={{ maxWidth: "100%" }} id={product.id} data-row-id={product.id} > {/* onClick={handleClick} */}
        <div className="row g-0">
          <div className="col-3 image-container" style={{ background: `url(${product.urlImage || defaultImage})` }}>
            {/* <img src={product.urlImage || defaultImage} className="img-fluid rounded-start" alt="..."/> */}
          </div>
          <div className="col-9">
            <div className="card-body">

              <div className='row'>
                <div className='col'>
                  <div className='row'>
                    <div className='col'><h5 className={`card-title ${moment(product.expiryDate).diff(moment(), 'days') < 3 ? 'imminent' : ''}`}>{moment(product.expiryDate).locale('es').format('DD MMM YYYY')}</h5></div>
                  </div>
                  <div className='row'>
                    <p className="card-text">{product.name}</p>
                  </div>
                  <div className='row'>
                    <p className="card-text"><small className="text-body-secondary">{product.barcode}</small></p>
                  </div>
                </div>
                <div className='col-4 col-tags me-2'>
                  {product.tags.map((tag) => <span key={tag} className="badge bg-dark mb-1">{tag}</span>)}
                  <span className='d-flex direction-col align-items-end' style={{fontSize: '0.95rem', textAlign: 'center', fontStyle: 'italic', lineHeight: '14px'}}>{
                      moment(product.expiryDate).diff(moment(), 'days') < 7 && moment(product.expiryDate).diff(moment(), 'days') >= 0 &&
                      `${moment(product.expiryDate).diff(moment(), 'days')} days left`}
                    </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

ProductItem.defaultProps = {
  onClick: () => { }
}

export default ProductItem