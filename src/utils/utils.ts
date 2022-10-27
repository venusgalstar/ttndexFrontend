const displayRemainTime = (seconds) => {
    if (!Number.isNaN(seconds) && parseInt(seconds) > 0) {
        const secondsVal = parseInt(seconds) + 150
        // Calculating the days, hours, minutes and seconds left
        const timeDays = Math.floor(seconds / (60 * 60 * 24))
        const timeHours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60))
        const timeMinutes = Math.floor((seconds % (60 * 60)) / 60)

        if (timeDays > 0) {
            return `${timeDays}D : ${timeHours}H`
        }
        return `${timeHours}H : ${timeMinutes}M`
    }

    return `0H : 0M`
}

export default displayRemainTime