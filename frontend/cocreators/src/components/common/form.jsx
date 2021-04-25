import React from 'react'




export default function RegisterForm({onsubmit,error,setError,url,onUrlChange}){



    return (
        <form onSubmit={onsubmit} className="bg-white rounded" >
                {error && <div class="g-red-100 border border-red-400 text-red-700 px-4 py-3 mt-2 rounded" role="alert">{error}</div>}
                <div className="my-4 flex flex-row">
                    
                    <input className="border rounded py-2 px-3 mr-2 text-gray-700"  
                    value={url}
                    onChange={({target})=>{
                        
                        onUrlChange(target.value)
                        setError('')
                    }}
                    id='name'
                    type='text'
                    placeholder='http(s)//:example.com'
                    />
                    <button className="bg-blue-900 text-blue-100 font-bold py-2 px-4 rounded" type="submit"> Submit</button>
                </div>
            
        </form>
    )

}