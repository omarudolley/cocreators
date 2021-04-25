import React from 'react' 
import _ from 'lodash'
import propTypes from 'prop-types'


const Pagination = (props) => {
    const {itemsCount,pageSize,currentPage,onPageChange} = props;
    const pagesCount = Math.ceil(itemsCount / pageSize)
    if (pagesCount === 1) return null
    const pages = _.range(1,pagesCount+1)


    return (
    <nav >
        <ul className="flex h-8 m-3 font-medium " >
       
        {pages.map( page =>
        <li key={page} className=" " ><a className={ page === currentPage? "md:flex justify-center items-center hidden w-8 bg-blue-900 text-white rounded-full":"md:flex justify-center items-center hidden w-8" } onClick={()=>onPageChange(page)}>{page}</a></li>
        )}
       
        </ul>
    </nav>
    )
}

Pagination.propTypes = {
    itemsCount:propTypes.number.isRequired,
    pageSize:propTypes.number.isRequired,
    currentPage:propTypes.number.isRequired,
    onPageChange:propTypes.func.isRequired
}


export default Pagination