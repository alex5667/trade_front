'use client'

import { useEffect, useState } from 'react'

export default function TestPage() {
	const [status, setStatus] = useState('Disconnected')
	const [messages, setMessages] = useState<string[]>([])
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		// Create WebSocket connection
		const socket = new WebSocket('ws://localhost:4200')

		// Connection opened
		socket.addEventListener('open', event => {
			console.log('Connected to WebSocket server')
			setStatus('Connected')
			setMessages(prev => [...prev, 'Connection established'])
		})

		// Listen for messages
		socket.addEventListener('message', event => {
			console.log('Message from server:', event.data)
			setMessages(prev => [...prev, `Received: ${event.data}`])

			try {
				const data = JSON.parse(event.data)
				console.log('Parsed data:', data)
			} catch (e) {
				console.error('Error parsing message:', e)
			}
		})

		// Listen for errors
		socket.addEventListener('error', event => {
			console.error('WebSocket error:', event)
			setStatus('Error')
			setError('Connection error')
		})

		// Listen for close
		socket.addEventListener('close', event => {
			console.log('Connection closed:', event.code, event.reason)
			setStatus('Disconnected')
			setMessages(prev => [...prev, `Connection closed: ${event.code}`])
		})

		// Cleanup on unmount
		return () => {
			console.log('Closing WebSocket connection')
			socket.close()
		}
	}, [])

	return (
		<div className='p-8'>
			<h1 className='text-2xl font-bold mb-4'>WebSocket Test Page</h1>

			<div className='mb-4'>
				<div className='font-bold'>Connection Status:</div>
				<div
					className={`
          ${status === 'Connected' ? 'text-green-500' : ''}
          ${status === 'Disconnected' ? 'text-gray-500' : ''}
          ${status === 'Error' ? 'text-red-500' : ''}
        `}
				>
					{status}
				</div>
				{error && <div className='text-red-500 mt-2'>{error}</div>}
			</div>

			<div>
				<div className='font-bold mb-2'>Messages:</div>
				<div className='border p-4 bg-gray-100 rounded h-96 overflow-auto'>
					{messages.length === 0 ? (
						<div className='text-gray-500'>No messages yet</div>
					) : (
						<div className='space-y-2'>
							{messages.map((msg, i) => (
								<div
									key={i}
									className='bg-white p-2 rounded shadow'
								>
									{msg}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
