package main

import (
	"fmt"
	"log"
	"net/http"
)

// server for running the game
func main() {

	//Set configurations for server
	myhttp := http.NewServeMux()
	fileServer := http.FileServer(http.Dir("./static/"))
	myhttp.Handle("/static/", http.StripPrefix("/static", fileServer))

	myhttp.HandleFunc("/socket", socketHandler)
	myhttp.HandleFunc("/", mainHandler)
	fmt.Printf("Started server at http://localhost:8080\n")
	//Run server
	if err := http.ListenAndServe(":8080", myhttp); err != nil {
		log.Fatal(err)
	}
}
