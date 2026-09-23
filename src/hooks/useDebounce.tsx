import { useEffect, useState } from "react"

export default function useDebounce<T>(valor: T, ms: number): T {
    const [diferido, setDiferido] = useState<T>(valor)
    useEffect(() => {
        const id = setTimeout(() => setDiferido(valor), ms)
        return () => clearTimeout(id)
    }, [valor, ms])
    return diferido
}