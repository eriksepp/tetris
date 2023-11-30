package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type Message struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}

type Ranking struct {
	Rank       int
	Percentile string
	Position   int
}

var upgrader = websocket.Upgrader{}

// implement Unmarshaler interface
func (m *Message) UnmarshalJSON(data []byte) error {
	type copyMessage Message
	var tmpMessage copyMessage
	json.Unmarshal(data, &tmpMessage)
	if tmpMessage.Type == "addEntry" {
		jsonObjectOfPayload, err := json.Marshal(tmpMessage.Payload)
		if err != nil {
			return fmt.Errorf("error when marshaling payload: %w", err)
		}

		var score Score
		err = json.Unmarshal(jsonObjectOfPayload, &score)
		if err != nil {
			return fmt.Errorf("error when unmarshaling payload into score %w", err)
		}

		m.Type = tmpMessage.Type
		m.Payload = score
		return nil
	}

	*m = Message(tmpMessage)
	return nil
}

// If new entry received, get the payload, add to database and send upadated scores to client
func saveScore(message Message) error {
	score, ok := message.Payload.(Score)
	if !ok {
		return fmt.Errorf("invalid payload for scores in message %#v", message)
	}

	err := writeScoreToFile(score)
	if err != nil {
		return fmt.Errorf("error when adding score to database: %w", err)
	}

	return nil
}

func sendScoresToClient(conn *websocket.Conn, typeSuffix string) error {
	// Get scores
	scores, err := getAllScores()
	if err != nil {
		return fmt.Errorf("failed to get all scores: %v", err)

	}

	// Create message
	message := Message{
		Type:    "scoreboard" + "_" + typeSuffix,
		Payload: scores,
	}

	// Send scores to front-end
	if err := conn.WriteJSON(message); err != nil {
		return fmt.Errorf("failed to send scores %w", err)
	}

	return nil
}

// If rank and percentile was requested, calculate them and send back
func getRanking(message Message) (Ranking, error) {
	// Get score from payload
	score, ok := message.Payload.(float64)
	if !ok {
		return Ranking{}, fmt.Errorf("invalid payload for getRanking")
	}
	// Get rank and percentile
	rank, percentile, position, err := calcRankAndPercentile(score)
	if err != nil {
		return Ranking{}, fmt.Errorf("couldn't get rank and percentile %w", err)
	}

	return Ranking{
		Rank:       rank,
		Percentile: percentile,
		Position:   position,
	}, nil
}

func sendRankingToClient(conn *websocket.Conn, ranking Ranking) error {
	// Create message
	message := Message{
		Type:    "ranking",
		Payload: ranking,
	}

	if err := conn.WriteJSON(message); err != nil {
		return fmt.Errorf("failed to send scores %w", err)
	}

	return nil
}

func socketHandler(w http.ResponseWriter, r *http.Request) {
	// Upgrade raw HTTP connection to a websocket based one
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("error during connection upgradation:", err)
		return
	}
	defer conn.Close()

	// After establishing connection get and send all scores
	sendScoresToClient(conn, "start")

	// The event loop
	for {
		// Wait for new message
		var message Message
		err := conn.ReadJSON(&message)
		if err != nil {
			log.Println("error during message reading:", err)
			break
		}

		// Check message type
		switch message.Type {
		case "addEntry":
			if err := saveScore(message); err != nil {
				log.Println(err)
			}
			if err := sendScoresToClient(conn, "added"); err != nil {
				log.Println(err)
			}
		case "getRanking":
			ranking, err := getRanking(message)
			if err != nil {
				log.Println(err)
			}
			if err = sendRankingToClient(conn, ranking); err != nil {
				log.Println(err)
			}

		default:
			log.Println("unknown type message received:", message.Type)
		}
	}
}

// Handle the main page
func mainHandler(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("index.html")
	if err != nil {
		http.Redirect(w, r, "/", http.StatusInternalServerError)
		return
	}
	if e := tmpl.Execute(w, ""); e != nil {
		http.Redirect(w, r, "/", http.StatusInternalServerError)
	}
}
