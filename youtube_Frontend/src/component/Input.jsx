import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
   label,
   required = true,
   type = 'text',
   className = "",
   ...props
}, ref) {
   const id = useId()
   return (
      <div className='w-full mb-4'>
         {label && <label
            className={`block text-gray-600 font-medium mb-1 ml-1 pl-1 ${className}`}
            htmlFor={id}>
            {label}</label>
         }
         <input
            type={type}
            className={`w-full px-3 py-2 text-block rounded-lg duration-200 border 
               focus:border-orange-400 outline-none focus:outline-none ${className}`}
            {...props}
            ref={ref}
            id={id}
            required={required}
         />
      </div>
   )
})

export default Input;