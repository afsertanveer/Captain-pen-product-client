import React from 'react';
import ReactPaginate from 'react-paginate';

const Pagination = ({ pageCount, currentPage = 1, handlePageClick }) => {
    return (
        <div>
    <ReactPaginate
      breakLabel="..."
      pageLinkClassName="py-2 px-4"
      nextLabel="Next"
      disableInitialCallback={true}
      nextClassName="flex justify-center items-center"
      onPageChange={handlePageClick}
      pageRangeDisplayed={3}
      pageCount={pageCount}
      previousLabel="Prev"
      previousClassName="flex justify-center items-center"
      className="flex justify-end space-x-2 md:space-x-1 flex-wrap "
      activeClassName="bg-[#1b5e20]"
      pageClassName="w-10 md:w-6 items-center flex justify-center px-4  rounded-md border border-black font-semibold"
      activeLinkClassName="text-white"
      disabledClassName="text-gray-300  focus:outline-none"
    />
        </div>
    );
};

export default Pagination;


