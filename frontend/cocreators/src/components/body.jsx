import React, { useEffect, useState } from 'react'
import RegisterForm from './common/form'
import Pagination from './common/pagination'
import axios from 'axios'
import {is_valid_url,paginate} from './utils'



const Body =()=>{

    const [addresses,setAddresses]=useState([])
    const [toggleForm,setToggleForm]=useState(false)
    const [url,setUrl] = useState('')
    const [error,setError] = useState('')
    const [pageSize,setPageSize]= useState(3)
    const [currentPage,setcurrentPage]= useState(1)

    const handlesubmit = (event)=>{
        event.preventDefault()

        if(!is_valid_url(url)){
            setError('Please enter a valid domain name')
            return
        }
        const new_addresses = [...addresses]
        new_addresses.push({address:url,status:'loading...'})
    
        setAddresses(new_addresses)
        setUrl('')
        setToggleForm(!toggleForm)

        axios.post('http://127.0.0.1:5000/api/website',{title:url})
        .then(res => setAddresses(res.data))
        .catch(error => console.log(error.message))
    }


    const handleDelete = (site)=>{
        const new_addresses = [...addresses]
        const new_address_list = new_addresses.filter(item => item.address !== site.address)
      
        if (new_address_list.length >= pageSize && new_address_list.length % pageSize === 0){
            setcurrentPage(currentPage-1)
        }
        setAddresses(new_address_list)

        axios.post('http://127.0.0.1:5000/api/website/delete',{title:site.address})
        .then(res => console.log(res))
        .catch(error => console.log(error.message))
    }

 
    useEffect(() => {
        const interval = setInterval(async() => {
            axios.get('http://127.0.0.1:5000/api/website')
            .then(res => res.data)
            .then(data => setAddresses(data))
            .catch(error=>console.log(error))},60000)
        return () => clearInterval(interval);
        }, []);
    

    useEffect(() => {
            axios.get('http://127.0.0.1:5000/api/website')
            .then(res => res.data)
            .then(data => setAddresses(data))
            .catch(error=>console.log(error))
        }, []);

    const renderStatus = (status)=>{
        let statusClass = " py-1 px-3 rounded-full text-sm"
        if (status === 'OK'){
            statusClass += " bg-green-200"
        }else if (status === 'DOWN'){
            statusClass += " bg-red-200"
        }else if (status ==="SLOW"){
            statusClass += " bg-orange-200"
        }
        else{
            statusClass += "bg-gray-200"
        }
        return <span className={statusClass}>{status}</span>
    }

    const renderAddress = ()=> paginate(addresses,currentPage,pageSize)


    return (
        <>
    
            <div className="m-auto mt-8 w-2/3 max-w-2xl">
                <button 
                    onClick={()=>{
                        setToggleForm(!toggleForm)
                        setUrl('')
                        setError('')
                    }}
                    className="bg-blue-900 text-blue-100 font-bold py-2 px-4 rounded" >
                         Add
                </button>
                <div className="flex flex-col">
                    {toggleForm && <RegisterForm url={url} error={error} setError={setError} onUrlChange={setUrl} onsubmit={handlesubmit}/>}
                    <h1 className="text-gray-700 text-3xl my-2 font-bold uppercase">Websites</h1>
                    <table className="min-w-max w-4xl shadow-md rounded shadow-md rounded table-auto">
                        <thead className="bg-blue-900 text-blue-100 font-bold uppercase text-sm leading-normal">
                            <tr>
                                <th className="w-1/2 py-3 px-6 text-left">Domain <span class='lowercase font-normal'>(http(s)://example.com)</span></th>
                                <th className="w-1/4 py-3 px-6 text-left">Status</th>
                                <th className="w-1/4 py-3 px-6 text-left"></th>
                            
                            </tr>
                        </thead>
                        <tbody className="text-gray-900 text-sm font-light">
                            {renderAddress().map( (site,index) => 
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100" >
                                    <td className="py-3 px-6 text-left whitespace-nowrap" >{site.address}</td>
                                    <td className="py-3 px-6 text-left">{renderStatus(site.status)}</td>
                                    <td>
                                        <div onClick={()=>handleDelete(site)}  className="w-4 mr-2 transform hover:text-blue-500 hover:scale-110">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination 
                        itemsCount={addresses.length} 
                        pageSize={pageSize} 
                        currentPage={currentPage} 
                        onPageChange={page => setcurrentPage(page)}
                    />
                </div>
        </div>
        </>
    )
}


export default Body