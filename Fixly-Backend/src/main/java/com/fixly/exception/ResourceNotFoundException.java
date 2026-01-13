package com.fixly.exception;

public class ResourceNotFoundException extends RuntimeException{
	
	public ResourceNotFoundException(String message)
	{
		super(message);
	}

}
